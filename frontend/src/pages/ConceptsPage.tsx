import { useMemo, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import type { Concept } from '../api'
import NewConceptModal from '../components/NewConceptModal'
import GaugeBar from '../components/GaugeBar'
import { useConcepts } from '../hooks/useConcepts'
import { glass, Button, GlassCard, Muted, Pill } from '../styles/shared'

type GaugeFilter = 'all' | 'learning' | 'near-mastery'

const Page = styled.div`
  padding: 34px 40px 48px;
  display: flex;
  flex-direction: column;
  gap: 26px;
`

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
`

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Breadcrumb = styled.div`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 12px;
  color: ${(p) => p.theme.color.ink3};
`

const Title = styled.h1`
  font-size: 38px;
  font-weight: 600;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.025em;
`

const Subtitle = styled.div`
  font-size: 14px;
  color: ${(p) => p.theme.color.ink3};
`

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  background: ${(p) => p.theme.surface.glass5};
  border: 1px solid ${(p) => p.theme.border.bd2};
  border-radius: ${(p) => p.theme.radius.sm};
  padding: 0 14px;
  height: 44px;
  width: 240px;
  ${glass(26)}
`

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: none;
  font-size: 14px;
  color: ${(p) => p.theme.color.ink};

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${(p) => p.theme.color.ink4};
  }
`

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(238px, 1fr));
  gap: 18px;
`

const Card = styled(GlassCard)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 176px;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;

  &:hover {
    background: ${(p) => p.theme.surface.glass6};
    box-shadow: 0 22px 44px -24px rgba(23, 60, 92, 0.8);
  }
`

const CardTerm = styled.div`
  font-size: 19px;
  font-weight: 700;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.01em;
`

const CardDefinition = styled.div`
  font-size: 13.5px;
  line-height: 1.65;
  color: ${(p) => p.theme.color.ink3};
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const GAUGE_FILTERS: { key: GaugeFilter; label: string; test: (gauge: number) => boolean }[] = [
  { key: 'all', label: '전체', test: () => true },
  { key: 'learning', label: '학습 중', test: (g) => g < 80 },
  { key: 'near-mastery', label: '거의 마스터', test: (g) => g >= 80 },
]

export default function ConceptsPage({ status }: { status: Concept['status'] }) {
  const navigate = useNavigate()
  const { data: concepts = [], isLoading } = useConcepts()
  const [search, setSearch] = useState('')
  const [gaugeFilter, setGaugeFilter] = useState<GaugeFilter>('all')
  const [showNewConcept, setShowNewConcept] = useState(false)

  const filtered = useMemo(() => {
    const activeTest = GAUGE_FILTERS.find((f) => f.key === gaugeFilter)!.test
    return concepts
      .filter((c) => c.status === status)
      .filter((c) => activeTest(c.mastery_gauge))
      .filter((c) => c.term.toLowerCase().includes(search.trim().toLowerCase()))
  }, [concepts, status, gaugeFilter, search])

  const isMasteredView = status === 'mastered'
  const title = isMasteredView ? '마스터함' : '내 사전'
  const total = concepts.filter((c) => c.status === status).length

  return (
    <Page>
      <Header>
        <HeaderText>
          <Breadcrumb>/concepts{isMasteredView ? '/mastered' : ''}</Breadcrumb>
          <Title>{title}</Title>
          <Subtitle>
            {isMasteredView ? `마스터한 개념 ${total}개` : `학습 중인 개념 ${total}개`}
          </Subtitle>
        </HeaderText>
        <HeaderActions>
          <SearchBox>
            <FiSearch color="inherit" />
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="개념 검색"
            />
          </SearchBox>
          {!isMasteredView && <Button onClick={() => setShowNewConcept(true)}>+ 새 개념</Button>}
        </HeaderActions>
      </Header>

      {!isMasteredView && (
        <FilterRow>
          {GAUGE_FILTERS.map((f) => (
            <Pill key={f.key} $active={gaugeFilter === f.key} onClick={() => setGaugeFilter(f.key)}>
              {f.label}
            </Pill>
          ))}
        </FilterRow>
      )}

      <Grid>
        {filtered.map((c) => (
          <Card key={c.id} onClick={() => navigate(`/concepts/${c.id}`)}>
            <CardTerm>{c.term}</CardTerm>
            <CardDefinition>{c.definition}</CardDefinition>
            <GaugeBar value={c.mastery_gauge} />
          </Card>
        ))}
        {!isLoading && filtered.length === 0 && (
          <Muted>{isMasteredView ? '아직 마스터한 개념이 없습니다.' : '아직 등록된 개념이 없습니다.'}</Muted>
        )}
      </Grid>

      {showNewConcept && <NewConceptModal onClose={() => setShowNewConcept(false)} />}
    </Page>
  )
}
