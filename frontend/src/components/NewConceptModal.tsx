import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { api } from '../api'
import { flashAiPhase } from '../store/useAiActivityStore'
import {
  Button,
  Choices,
  ChoiceLabel,
  Input,
  Modal,
  ModalActions,
  ModalOverlay,
  Muted,
  Pill,
  Textarea,
} from '../styles/shared'

import {
  ModalHeader,
  ModalTitleGroup,
  ModalTitle,
  ModalSubtitle,
  CloseButton,
  Field,
  FieldLabel,
  CategoryRow,

  SingleMeaning,
} from './NewConceptModal.styles'

type Step = 1 | 2

export default function NewConceptModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  const [step, setStep] = useState<Step>(1)
  const [term, setTerm] = useState('')
  const [context, setContext] = useState('')
  const [seenMeanings, setSeenMeanings] = useState<string[]>([])
  const [selected, setSelected] = useState('')
  const hasFetchedRef = useRef(false)

  const interpret = useMutation({
    mutationFn: (exclude: string[]) => api.interpretTerm(term, exclude),
    onMutate: () => flashAiPhase('thinking'),
    onSuccess: (res) => {
      flashAiPhase('done')
      setSelected(res.meanings[0] ?? '')
      setSeenMeanings((prev) => [...prev, ...res.meanings])
    },
    onError: () => flashAiPhase('error'),
  })

  const createConcept = useMutation({
    mutationFn: (definition: string) => api.createConcept(term, definition),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concepts'] })
      onClose()
    },
  })

  useEffect(() => {
    if (step !== 2 || hasFetchedRef.current) return
    hasFetchedRef.current = true
    interpret.mutate([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const goToStep2 = () => {
    if (!term.trim()) return
    setStep(2)
  }

  const loading = interpret.isPending
  const isAmbiguous = interpret.data?.is_ambiguous ?? false
  const meanings = interpret.data?.meanings ?? []

  if (step === 1) {
    return (
      <ModalOverlay>
        <Modal $wide>
          <ModalHeader>
            <ModalTitleGroup>
              <ModalTitle>새 개념</ModalTitle>
              <ModalSubtitle>용어만 적으면 정의는 이 앱이 만들어 드립니다.</ModalSubtitle>
            </ModalTitleGroup>
            <CloseButton onClick={onClose}>×</CloseButton>
          </ModalHeader>

          <Field>
            <FieldLabel>용어</FieldLabel>
            <Input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && goToStep2()}
              placeholder="예: 클로저"
              autoFocus
            />
          </Field>

          <Field>
            <FieldLabel>분류</FieldLabel>
            <CategoryRow>
              <Pill $active>개념</Pill>
              <Pill disabled title="코드 학습 기능은 준비 중입니다">
                코드
              </Pill>
            </CategoryRow>
          </Field>

          <Field>
            <FieldLabel>맥락 (선택)</FieldLabel>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="어디서 봤는지, 어떤 관점으로 이해하고 싶은지 적어두면 이해에 도움이 됩니다."
              rows={3}
            />
          </Field>

          <ModalActions>
            <Button $variant="secondary" onClick={onClose}>
              취소
            </Button>
            <Button onClick={goToStep2} disabled={!term.trim()}>
              의미 만들기
            </Button>
          </ModalActions>
        </Modal>
      </ModalOverlay>
    )
  }

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Modal $wide>
        <ModalHeader>
          <ModalTitleGroup>
            <FieldLabel>2 / 2 · 의미 확인</FieldLabel>
            <ModalTitle>{term}</ModalTitle>
          </ModalTitleGroup>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        {loading && <Muted>의미를 확인하는 중...</Muted>}

        {!loading && isAmbiguous && (
          <Field>
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
          </Field>
        )}

        {!loading && !isAmbiguous && meanings[0] && (
          <Field>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FieldLabel>생성된 의미</FieldLabel>
              <Button $variant="ghost" onClick={() => interpret.mutate(seenMeanings)}>
                다시 생성
              </Button>
            </div>
            <SingleMeaning>{meanings[0]}</SingleMeaning>
          </Field>
        )}

        {!loading && (
          <ModalActions>
            <Button $variant="secondary" onClick={() => setStep(1)}>
              이전
            </Button>
            {isAmbiguous && (
              <Button $variant="secondary" onClick={() => interpret.mutate(seenMeanings)}>
                다른 의미로 다시 추론
              </Button>
            )}
            <Button
              onClick={() => createConcept.mutate(selected)}
              disabled={!selected || createConcept.isPending}
            >
              사전에 추가
            </Button>
          </ModalActions>
        )}
      </Modal>
    </ModalOverlay>
  )
}
