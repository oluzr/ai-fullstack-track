import { useMemo, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import type { Concept } from '../types'
import NewConceptModal from '../components/NewConceptModal'
import GaugeBar from '../components/GaugeBar'
import { useConcepts } from '../hooks/useConcepts'
import { Button, Muted, Pill } from '../styles/shared'
import {
  Page,
  Header,
  HeaderText,
  Breadcrumb,
  Title,
  Subtitle,
  HeaderActions,
  SearchBox,
  SearchInput,
  FilterRow,
  Grid,
  Card,
  CardTerm,
  CardDefinition,
} from './ConceptsPage.styles'

type GaugeFilter = 'all' | 'learning' | 'near-mastery'

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
  const title = isMasteredView ? '마스터함' : '📖 내 사전'
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
