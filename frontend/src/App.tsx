import { useState } from 'react'
import type { Concept } from './api'
import ConceptDetail from './components/ConceptDetail'
import ConceptList from './components/ConceptList'

function App() {
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null)

  return (
    <div className="app">
      {selectedConcept ? (
        <ConceptDetail
          concept={selectedConcept}
          onBack={() => setSelectedConcept(null)}
          onMastered={() => setSelectedConcept(null)}
        />
      ) : (
        <ConceptList onSelect={setSelectedConcept} />
      )}
    </div>
  )
}

export default App
