import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { FiMoon, FiSun } from 'react-icons/fi'
import ChatPanel from '../components/ChatPanel'
import { useConcepts } from '../hooks/useConcepts'
import { useAiActivityStore } from '../store/useAiActivityStore'
import { useThemeStore } from '../store/useThemeStore'
import {
  Shell,
  Frame,
  Glow,
  Inner,
  Sidebar,
  Brand,
  BrandText,
  BrandTitle,
  BrandUser,
  NavGroup,
  NavGroupLabel,
  NavItem,
  NavCount,
  Footer,
  Divider,
  ThemeToggle,
  Main,
  RobotDock,
  RobotPop,
  LogoIcon,
} from './AppShell.styles'
import LLMModel from '../components/LLMModel'

export default function AppShell() {
  const { data: concepts = [] } = useConcepts()
  const activeCount = concepts.filter((c) => c.status === 'active').length
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const aiPhase = useAiActivityStore((s) => s.phase)
  const aiActive = aiPhase !== 'idle'
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <Shell>
      <Frame $chatOpen={isChatOpen}>
        <Glow />
        <Inner>
          <Sidebar>
            <Brand>
              {/* <Logo /> */} 
              <LogoIcon>📖</LogoIcon>
              <BrandText>
                <BrandTitle>개념 사전</BrandTitle>
                <BrandUser>oluzr</BrandUser>
              </BrandText>
            </Brand>

            <NavGroup>
              <NavGroupLabel>사전</NavGroupLabel>
              <NavItem to="/concepts" end>
                <span>내 사전</span>
                <NavCount>{activeCount}</NavCount>
              </NavItem>
              <NavItem to="/concepts/review">오늘 복습</NavItem>
              <NavItem to="/concepts/notes">메모</NavItem>
              <NavItem to="/concepts/mastered">마스터함</NavItem>
            </NavGroup>

            <NavGroup>
              <NavGroupLabel>코드 학습</NavGroupLabel>
              <NavItem to="/code/read">코드 읽기</NavItem>
              <NavItem to="/code/solve">문제 풀기</NavItem>
              <NavItem to="/code/progress">학습 현황</NavItem>
              <NavItem to="/code/submissions">제출 기록</NavItem>
            </NavGroup>

            <Footer>
              <Divider />
              <ThemeToggle onClick={toggleTheme}>
                {theme === 'dark' ? <FiSun /> : <FiMoon />}
                {theme === 'dark' ? '라이트 모드' : '다크 모드'}
              </ThemeToggle>
              <NavItem to="/settings">설정</NavItem>
            </Footer>
          </Sidebar>

          <Main>
            <Outlet />
          </Main>
        </Inner>

        {isChatOpen && <ChatPanel onClose={() => setIsChatOpen(false)} />}
      </Frame>

      {/* Frame이 overflow:hidden이라 카드 안에 있으면 절대 카드 밖으로 못 나가서,
          Frame의 형제로 뺐다. Frame 왼쪽 바깥 가장자리에 걸치도록 배치. */}
      <RobotDock $chatOpen={isChatOpen}>
        <RobotPop $active={aiActive} onClick={() => setIsChatOpen((v) => !v)}>
          <LLMModel size={106} state={aiPhase} />
        </RobotPop>
      </RobotDock>
    </Shell>
  )
}
