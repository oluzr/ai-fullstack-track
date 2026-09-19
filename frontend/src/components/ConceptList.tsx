import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FiMoon, FiPlus, FiSun } from 'react-icons/fi'
import styled from 'styled-components'
import { api, type Concept } from '../api'
import { Button, ErrorText, Muted } from '../styles/shared'
import { useThemeStore } from '../store/useThemeStore'
import GaugeBar from './GaugeBar'
import MeaningModal from './MeaningModal'

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`

const ThemeToggle = styled.button`
  background: none;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 999px;
  width: 2.25rem;
  height: 2.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(p) => p.theme.colors.text};
`

const AddForm = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 6px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
`

const Card = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: box-shadow 0.15s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`

export default function ConceptList({ onSelect }: { onSelect: (c: Concept) => void }) {
  const queryClient = useQueryClient()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const { data: concepts = [] } = useQuery({
    queryKey: ['concepts'],
    queryFn: api.listConcepts,
  })

  const [term, setTerm] = useState('')
  const [interpretingTerm, setInterpretingTerm] = useState<string | null>(null)

  const createConcept = useMutation({
    mutationFn: (vars: { term: string; definition: string }) =>
      api.createConcept(vars.term, vars.definition),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concepts'] })
      setTerm('')
      setInterpretingTerm(null)
    },
    onError: () => {
      setInterpretingTerm(null)
    },
  })

  const handleAdd = () => {
    const value = term.trim()
    if (!value) return
    createConcept.reset()
    setInterpretingTerm(value)
  }

  const handleConfirmMeaning = (definition: string) => {
    if (!interpretingTerm) return
    createConcept.mutate({ term: interpretingTerm, definition })
  }

  return (
    <div>
      <Header>
        <h1>내 개념 사전</h1>
        <ThemeToggle onClick={toggleTheme} aria-label="다크모드 전환">
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </ThemeToggle>
      </Header>

      <AddForm>
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="새 개념 등록 (예: 클로저)"
        />
        <Button onClick={handleAdd} disabled={createConcept.isPending}>
          <FiPlus /> 등록
        </Button>
      </AddForm>
      {createConcept.isError && <ErrorText>등록에 실패했습니다</ErrorText>}

      <Grid>
        {concepts.map((c) => (
          <Card key={c.id} onClick={() => onSelect(c)}>
            <h3>{c.term}</h3>
            <GaugeBar value={c.mastery_gauge} />
          </Card>
        ))}
        {concepts.length === 0 && <Muted>아직 등록된 개념이 없습니다.</Muted>}
      </Grid>

      {interpretingTerm && (
        <MeaningModal
          term={interpretingTerm}
          onCancel={() => setInterpretingTerm(null)}
          onConfirm={handleConfirmMeaning}
        />
      )}
    </div>
  )
}
