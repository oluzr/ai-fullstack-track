import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './layout/AppShell'
import CodeReadPage from './pages/CodeReadPage'
import CodeResultPage from './pages/CodeResultPage'
import CodeSolvePage from './pages/CodeSolvePage'
import ComingSoonPage from './pages/ComingSoonPage'
import ConceptDetailPage from './pages/ConceptDetailPage'
import ConceptsPage from './pages/ConceptsPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/concepts" replace />} />
          <Route path="concepts" element={<ConceptsPage status="active" />} />
          <Route path="concepts/mastered" element={<ConceptsPage status="mastered" />} />
          <Route path="concepts/review" element={<ComingSoonPage title="오늘 복습" />} />
          <Route path="concepts/notes" element={<ComingSoonPage title="메모" />} />
          <Route path="concepts/:id" element={<ConceptDetailPage />} />
          <Route path="code/read" element={<CodeReadPage />} />
          <Route path="code/solve" element={<CodeSolvePage />} />
          <Route path="code/result" element={<CodeResultPage />} />
          <Route path="code/progress" element={<ComingSoonPage title="학습 현황" />} />
          <Route path="code/submissions" element={<ComingSoonPage title="제출 기록" />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/concepts" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
