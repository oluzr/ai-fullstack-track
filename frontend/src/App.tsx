import { useState } from 'react'
import styled from 'styled-components'
import type { Concept } from './api'
import ConceptDetail from './components/ConceptDetail'
import ConceptList from './components/ConceptList'

const AppWrapper = styled.div`
  max-width: 720px;
  margin: 2rem auto;
  padding: 0 1rem 3rem;
`

function App() {
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null)

  return (
    <AppWrapper>
      {selectedConcept ? (
        <ConceptDetail
          concept={selectedConcept}
          onBack={() => setSelectedConcept(null)}
          onMastered={() => setSelectedConcept(null)}
        />
      ) : (
        <ConceptList onSelect={setSelectedConcept} />
      )}
    </AppWrapper>
  )
}

export default App
