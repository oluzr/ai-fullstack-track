import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './layout/AppShell'
import ChatHistoryDetailPage from './pages/ChatHistoryDetailPage'
import ChatHistoryPage from './pages/ChatHistoryPage'
import ComingSoonPage from './pages/ComingSoonPage'
import ConceptDetailPage from './pages/ConceptDetailPage'
import ConceptsPage from './pages/ConceptsPage'
import NotesPage from './pages/NotesPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/concepts" replace />} />
          <Route path="concepts" element={<ConceptsPage status="active" />} />
          <Route path="concepts/mastered" element={<ConceptsPage status="mastered" />} />
          <Route path="concepts/review" element={<ComingSoonPage title="오늘 복습" />} />
          <Route path="concepts/notes" element={<NotesPage />} />
          <Route path="concepts/:id" element={<ConceptDetailPage />} />
          <Route path="chats" element={<ChatHistoryPage />} />
          <Route path="chats/:id" element={<ChatHistoryDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/concepts" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
