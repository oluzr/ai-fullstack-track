import { NavLink, Outlet } from 'react-router-dom'
import { FiMoon, FiSun } from 'react-icons/fi'
import styled from 'styled-components'
import { useConcepts } from '../hooks/useConcepts'
import { useThemeStore } from '../store/useThemeStore'
import { glass } from '../styles/shared'

const Shell = styled.div`
  min-height: 100vh;
  padding: 24px;
  background: ${(p) => p.theme.gradient.art};
  background-attachment: fixed;
  display: flex;
`

const Frame = styled.div`
  position: relative;
  flex: 1;
  min-height: calc(100vh - 48px);
  border-radius: ${(p) => p.theme.radius.xxl};
  overflow: hidden;
  background: ${(p) => p.theme.surface.page};
  box-shadow: ${(p) => p.theme.shadow.sheet};
  ${glass(30)}
`

const Glow = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: ${(p) => p.theme.surface.glow};
`

const Inner = styled.div`
  position: relative;
  display: flex;
  min-height: 100%;

  @media (max-width: 860px) {
    flex-direction: column;
  }
`

const Sidebar = styled.aside`
  width: 248px;
  flex: none;
  background: ${(p) => p.theme.surface.glass2};
  border-right: 1px solid ${(p) => p.theme.border.bd1};
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  gap: 26px;
  ${glass(40)}

  @media (max-width: 860px) {
    width: auto;
    border-right: none;
    border-bottom: 1px solid ${(p) => p.theme.border.bd1};
  }
`

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
`

const Logo = styled.div`
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: ${(p) => p.theme.radius.sm};
  background: ${(p) => p.theme.gradient.logo};
  box-shadow: 0 6px 16px -6px rgba(52, 216, 172, 0.8);
`

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`

const BrandTitle = styled.span`
  font-size: 16px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.01em;
`

const BrandUser = styled.span`
  font-size: 11px;
  color: ${(p) => p.theme.color.ink3};
  font-family: ${(p) => p.theme.font.mono};
`

const NavGroup = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const NavGroupLabel = styled.div`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 10.5px;
  color: ${(p) => p.theme.color.ink3};
  letter-spacing: 0.09em;
  padding: 0 12px 6px;
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 13px;
  border-radius: ${(p) => p.theme.radius.sm};
  font-size: 14.5px;
  color: ${(p) => p.theme.color.ink3};

  &.active {
    background: ${(p) => p.theme.border.bd2};
    box-shadow: ${(p) => p.theme.shadow.activeNav};
    font-weight: 700;
    color: ${(p) => p.theme.color.ink};
  }
`

const NavCount = styled.span`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11px;
  color: ${(p) => p.theme.color.ink3};
`

const Footer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Divider = styled.div`
  height: 1px;
  background: ${(p) => p.theme.border.line};
`

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 13px;
  border: none;
  border-radius: ${(p) => p.theme.radius.sm};
  background: transparent;
  color: ${(p) => p.theme.color.ink3};
  font-size: 14px;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${(p) => p.theme.surface.glass3};
  }
`

const Main = styled.main`
  flex: 1;
  min-width: 0;
`

export default function AppShell() {
  const { data: concepts = [] } = useConcepts()
  const activeCount = concepts.filter((c) => c.status === 'active').length
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return (
    <Shell>
      <Frame>
        <Glow />
        <Inner>
          <Sidebar>
            <Brand>
              <Logo />
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
      </Frame>
    </Shell>
  )
}
