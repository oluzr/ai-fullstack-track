import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { glass, thinScrollbar } from '../styles/shared'

export const Shell = styled.div`
  position: relative;
  min-height: 100vh;
  padding: 24px;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 라이트 모드에선 그라디언트 없이 체크무늬만 쓴다 (연한 회색 바탕 위에 흰
     반투명 사각형이 번갈아 놓이는 대각선 체크무늬). */
  ${(p) =>
    p.theme.name === 'light'
      ? css`
          background-color: ${p.theme.surface.body};
          background-image:
            linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.6) 25%,
              transparent 25%,
              transparent 75%,
              rgba(255, 255, 255, 0.6) 75%,
              rgba(255, 255, 255, 0.6)
            ),
            linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.6) 25%,
              transparent 25%,
              transparent 75%,
              rgba(255, 255, 255, 0.6) 75%,
              rgba(255, 255, 255, 0.6)
            );
          background-size: 32px 32px;
          background-position: 0 0, 16px 16px;
        `
      : css`
          background-image: ${p.theme.gradient.art};
        `}
`

export const Frame = styled.div`
  position: relative;
  z-index: 2;
  /* flex: 1; */
  /* min-height: calc(100vh - 48px); */
  border-radius: ${(p) => p.theme.radius.md};
  overflow: hidden;
  background: ${(p) => p.theme.surface.page};
  box-shadow: ${(p) => p.theme.shadow.sheet};
  height:80vh;
  width:70vw;
  ${glass(7,false)};
`

// "카드 바깥으로 삐져나온 캐릭터" 연출. Frame(카드)이 overflow:hidden이라 로봇이
// Frame 안에 있으면 카드 경계 밖으로 절대 못 나가므로, Frame의 형제로 Shell에 바로
// 둔다. Shell은 Frame을 flex로 가운데 정렬하므로, Frame의 실제 좌측/하단 경계는
// Shell 기준 calc(50% - 35vw) / calc(50% - 40vh)에 온다(Frame이 70vw x 80vh라서
// 그 절반씩). 거기서 34px만 더 왼쪽으로 밀어서 카드 왼쪽 바깥 가장자리에 걸치게 한다.
//
// 평소(z-index 1) < Frame(z-index 2): Frame 안쪽으로 겹치는 부분은 Frame 내부의
// Sidebar 배경(불투명)에 가려지고, 카드 밖으로 나온 부분만 보인다.
// 활동 중(z-index 10) > Frame(2): 카드 밖에서 완전히 드러나며 더 커진다.
export const RobotDock = styled.div`
  position: absolute;
  left: calc(50% - 35vw - 50px);
  bottom: calc(10vh + 100px);
  width: 70px;
  height: 70px;
  pointer-events: none;

  @media (max-width: 860px) {
    display: none;
  }
`

export const RobotPop = styled.div<{ $active: boolean }>`
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: ${(p) => (p.$active ? 10 : 1)};
  transform: ${(p) => (p.$active ? 'translate(-16px, -8px) scale(1.15)' : 'translate(0, 0) scale(1)')};
  transform-origin: bottom right;
  transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
`

export const Glow = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: ${(p) => p.theme.surface.glow};
`

export const Inner = styled.div`
  position: relative;
  display: flex;
  height: 100%;

  @media (max-width: 860px) {
    flex-direction: column;
    height: auto;
  }
`

export const Sidebar = styled.aside`
  position: relative;
  width: 248px;
  flex: none;
  /* 로봇이 이 뒤에 실제로 가려지려면 어느 정도 불투명해야 해서 glass2 대신
     더 불투명한 solid 토큰을 쓴다 (다크모드 glass2는 거의 투명해서 안 가려짐). */
  background: ${(p) => p.theme.surface.solid};
  border-right: 1px solid ${(p) => p.theme.border.bd2};
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  gap: 26px;
  z-index: 5;
  ${glass(40)}

  @media (max-width: 860px) {
    width: auto;
    border-right: none;
    border-bottom: 1px solid ${(p) => p.theme.border.bd1};
  }
`

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
`

export const Logo = styled.div`
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: ${(p) => p.theme.radius.sm};
  background: ${(p) => p.theme.gradient.logo};
  box-shadow: 0 6px 16px -6px rgba(52, 216, 172, 0.8);
`
export const LogoIcon = styled.div`
  svg{
    width: 34px;
    height: 34px;
  }
`

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`

export const BrandTitle = styled.span`
  font-size: 16px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.01em;
`

export const BrandUser = styled.span`
  font-size: 11px;
  color: ${(p) => p.theme.color.ink3};
  font-family: ${(p) => p.theme.font.mono};
`

export const NavGroup = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const NavGroupLabel = styled.div`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 10.5px;
  color: ${(p) => p.theme.color.ink3};
  letter-spacing: 0.09em;
  padding: 0 12px 6px;
`

export const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 13px;
  border-radius: ${(p) => p.theme.radius.sm};
  font-size: 14.5px;
  color: ${(p) => p.theme.color.ink3};

  &.active {
    background: ${(p) => p.theme.surface.sideActive};
    /* box-shadow: ${(p) => p.theme.shadow.activeNav}; */
    font-weight: 600;
    color: ${(p) => p.theme.color.ink};
  }
`

export const NavCount = styled.span`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11px;
  color: ${(p) => p.theme.color.ink3};
`

export const Footer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Divider = styled.div`
  height: 1px;
  background: ${(p) => p.theme.border.line};
`

export const ThemeToggle = styled.button`
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

export const Main = styled.main`
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow-y: auto;
  ${thinScrollbar}

  @media (max-width: 860px) {
    height: auto;
    overflow-y: visible;
  }
`
