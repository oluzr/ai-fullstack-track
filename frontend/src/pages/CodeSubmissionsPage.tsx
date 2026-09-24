import { useQuery } from '@tanstack/react-query'
import { api } from '../api'
import { Muted } from '../styles/shared'
import {
  Page,
  Header,
  Breadcrumb,
  Title,
  Subtitle,
  List,
  SubmissionCard,
  SubmissionMeta,
  ProblemTag,
  LangTag,
  ScoreTag,
  SubmissionDate,
  SubmissionBody,
} from './CodeSubmissionsPage.styles'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export default function CodeSubmissionsPage() {
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['code-submissions'],
    queryFn: api.listCodeSubmissions,
  })

  return (
    <Page>
      <Header>
        <Breadcrumb>/code/submissions</Breadcrumb>
        <Title>제출 기록</Title>
        <Subtitle>{submissions.length}개의 제출 · LLM 리뷰 기준 (실제 실행 결과 아님)</Subtitle>
      </Header>

      <List>
        {!isLoading && submissions.length === 0 && <Muted>아직 제출한 코드가 없습니다.</Muted>}
        {submissions.map((s) => (
          <SubmissionCard key={s.id}>
            <SubmissionMeta>
              <ProblemTag>{s.problem_title}</ProblemTag>
              <LangTag>{s.language}</LangTag>
              <ScoreTag $passed={s.passed}>
                {s.score}/100 {s.passed ? '· 통과' : '· 미통과'}
              </ScoreTag>
            </SubmissionMeta>
            <SubmissionBody>{s.feedback.correctness}</SubmissionBody>
            <SubmissionDate>{formatDate(s.created_at)}</SubmissionDate>
          </SubmissionCard>
        ))}
      </List>
    </Page>
  )
}
