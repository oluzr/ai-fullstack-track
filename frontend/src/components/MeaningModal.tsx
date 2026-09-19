import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { api } from '../api'
import { Button, Choices, ChoiceLabel, Modal, ModalActions, ModalOverlay, Muted } from '../styles/shared'

const SingleMeaning = styled.p`
  background: ${(p) => p.theme.colors.highlight};
  border-radius: 6px;
  padding: 0.75rem;
  margin: 0.75rem 0;
`

export default function MeaningModal({
  term,
  onCancel,
  onConfirm,
}: {
  term: string
  onCancel: () => void
  onConfirm: (definition: string) => void
}) {
  const [seenMeanings, setSeenMeanings] = useState<string[]>([])
  const [selected, setSelected] = useState('')
  const hasFetchedRef = useRef(false)

  const interpret = useMutation({
    mutationFn: (exclude: string[]) => api.interpretTerm(term, exclude),
    onSuccess: (res) => {
      setSelected(res.meanings[0] ?? '')
      setSeenMeanings((prev) => [...prev, ...res.meanings])
    },
  })

  useEffect(() => {
    if (hasFetchedRef.current) return
    hasFetchedRef.current = true
    interpret.mutate([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term])

  const loading = interpret.isPending
  const isAmbiguous = interpret.data?.is_ambiguous ?? false
  const meanings = interpret.data?.meanings ?? []

  return (
    <ModalOverlay>
      <Modal $wide>
        <h3>&quot;{term}&quot; 의미 확인</h3>

        {loading && <Muted>의미를 확인하는 중...</Muted>}

        {!loading && isAmbiguous && (
          <>
            <Muted>여러 의미로 쓰일 수 있는 단어예요. 등록할 의미를 골라주세요.</Muted>
            <Choices>
              {meanings.map((m, i) => (
                <ChoiceLabel key={i}>
                  <input
                    type="radio"
                    name="meaning"
                    checked={selected === m}
                    onChange={() => setSelected(m)}
                  />
                  <span>
                    <strong>{i + 1}번 의미.</strong> {m}
                  </span>
                </ChoiceLabel>
              ))}
            </Choices>
          </>
        )}

        {!loading && !isAmbiguous && meanings[0] && <SingleMeaning>{meanings[0]}</SingleMeaning>}

        {!loading && (
          <ModalActions>
            {!isAmbiguous && (
              <Button $secondary onClick={() => interpret.mutate(seenMeanings)}>
                다른 의미로 다시 추론
              </Button>
            )}
            <Button onClick={() => onConfirm(selected)} disabled={!selected}>
              이 의미로 등록
            </Button>
            <Button $secondary onClick={onCancel}>
              취소
            </Button>
          </ModalActions>
        )}
      </Modal>
    </ModalOverlay>
  )
}
