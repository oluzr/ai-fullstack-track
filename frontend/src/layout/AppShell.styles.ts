import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import { glass, thinScrollbar } from "../styles/shared";

export const Shell = styled.div<{ $chatOpen?: boolean }>`
  position: relative;
  min-height: 100vh;
  padding: 24px;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Frame의 실제 너비를 여기 한 곳에만 적어두고, Frame 자신과 RobotDock(형제라
     상속으로만 값을 받을 수 있음) 둘 다 이 변수를 읽게 한다. 예전엔 이 너비
     공식을 Frame(width)과 RobotDock(left 계산)에 각각 따로 적어뒀는데,
     Frame 쪽 max-width나 폭을 건드릴 때마다 RobotDock 쪽을 깜빡하고 안 고쳐서
     로봇이 카드 가장자리와 어긋나는 문제가 있었다 — 이제는 값이 하나뿐이라
     어긋날 일이 없다. */
  --frame-w: ${(p) => (p.$chatOpen ? 'min(calc(70vw + 400px), 1900px)' : 'min(70vw, 1900px)')};

  /* 라이트 모드에선 그라디언트 없이 체크무늬만 쓴다 (연한 회색 바탕 위에 흰
     반투명 사각형이 번갈아 놓이는 대각선 체크무늬). */
  ${(p) =>
    p.theme.name === "light"
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
          background-position:
            0 0,
            16px 16px;
        `
      : css`
          background-image: ${p.theme.gradient.art};
        `}
`;

export const Frame = styled.div`
  position: relative;
  z-index: 2;
  /* flex: 1; */
  /* min-height: calc(100vh - 48px); */
  display: flex;
  border-radius: ${(p) => p.theme.radius.md};
  overflow: hidden;
  background: ${(p) => p.theme.surface.page};
  box-shadow: ${(p) => p.theme.shadow.sheet};
  height: 80vh;
  width: var(--frame-w);
  max-width: 1900px;
  transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  ${glass(7, false)};
`;

// "카드 바깥으로 삐져나온 캐릭터" 연출. Frame(카드)이 overflow:hidden이라 로봇이
// Frame 안에 있으면 카드 경계 밖으로 절대 못 나가므로, Frame의 형제로 Shell에 바로
// 둔다. Shell은 Frame을 flex로 가운데 정렬하므로, Frame의 실제 좌측 경계는 Shell
// 기준 calc(50% - var(--frame-w)/2)에 온다. 거기서 50px 더 왼쪽으로 밀어서 카드
// 왼쪽 바깥 가장자리에 걸치게 한다.
//
// 채팅 패널이 열리면 로봇을 왼쪽 가장자리에 그대로 붙잡아두는 대신(카드가 계속
// 넓어지는 동안 매번 새 오프셋을 손으로 맞춰야 해서 자꾸 어긋났었다) 반대쪽인
// Frame 오른쪽 가장자리로 옮겨 걸치게 한다 — 이번엔 채팅 패널까지 포함한
// Frame이 넓어지는 동안 동일한 계산식이 반대쪽에서 그대로 성립한다. 로봇
// 그림 자체가 "왼쪽으로 삐져나오는" 포즈라서 scaleX(-1)로 좌우 반전한다.
//
// 평소(z-index 1) < Frame(z-index 2): Frame 안쪽으로 겹치는 부분은 Frame 내부의
// Sidebar/ChatPanel 배경(둘 다 불투명한 surface.solid)에 가려지고, 카드 밖으로
// 나온 부분만 보인다.
// 활동 중(z-index 10) > Frame(2): 카드 밖에서 완전히 드러나며 더 커진다.
export const RobotDock = styled.div<{ $chatOpen?: boolean; $active?: boolean }>`
  position: absolute;
  ${(p) =>
    p.$chatOpen
      ? css`
          left: auto;
          right: calc(50% - var(--frame-w) / 2 - 50px);
        `
      : css`
          left: calc(50% - var(--frame-w) / 2 - 50px);
          right: auto;
        `}
  bottom: calc(10vh + 100px);
  width: 70px;
  height: 70px;
  pointer-events: none;
  transform: scaleX(${(p) => (p.$chatOpen ? -1 : 1)});
  /* transform이 있으면(scaleX(1)이라도) 이 요소가 새 stacking context를 만들어서,
     안쪽 RobotPop의 z-index(평소 1 / 활동 중 10)가 더 이상 Frame(z-index 2)과
     직접 비교되지 않고 여기 갇혀버린다 — 그러면 RobotDock 전체가 z-index:auto(=0)
     취급을 받아 활동 중에도 항상 Frame보다 아래로 깔린다. 그래서 같은 값을
     여기에도 반영해줘야 "평소엔 카드에 가려지고, 활동 중엔 위로 드러나는" 원래
     효과가 유지된다. */
  z-index: ${(p) => (p.$active ? 10 : 1)};

  @media (max-width: 860px) {
    display: none;
  }
`;

export const RobotPop = styled.div<{ $active: boolean }>`
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: ${(p) => (p.$active ? 10 : 1)};
  pointer-events: auto;
  cursor: pointer;
  transform: ${(p) =>
    p.$active
      ? "translate(-16px, -8px) scale(1.15)"
      : "translate(0, 0) scale(1)"};
  transform-origin: bottom right;
  transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

export const Glow = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: ${(p) => p.theme.surface.glow};
`;

export const Inner = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  min-width: 0;
  height: 100%;

  @media (max-width: 860px) {
    flex-direction: column;
    height: auto;
  }
`;

export const Sidebar = styled.aside`
  position: relative;
  width: 222px;
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
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
`;

export const Logo = styled.div`
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: ${(p) => p.theme.radius.sm};
  background: ${(p) => p.theme.gradient.logo};
  box-shadow: 0 6px 16px -6px rgba(52, 216, 172, 0.8);
`;
export const LogoIcon = styled.div`
  svg {
    width: 34px;
    height: 34px;
  }
`;

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

export const BrandTitle = styled.span`
  font-size: 16px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.01em;
`;

export const BrandUser = styled.span`
  font-size: 11px;
  color: ${(p) => p.theme.color.ink3};
  font-family: ${(p) => p.theme.font.mono};
`;

export const NavGroup = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const NavGroupLabel = styled.div`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 10.5px;
  color: ${(p) => p.theme.color.ink3};
  letter-spacing: 0.09em;
  padding: 0 12px 6px;
`;

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
`;

export const NavCount = styled.span`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11px;
  color: ${(p) => p.theme.color.ink3};
`;

export const Footer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Divider = styled.div`
  height: 1px;
  background: ${(p) => p.theme.border.line};
`;

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
`;

export const Main = styled.main`
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow-y: auto;
  background: ${(p) => p.theme.surface.mainBody};
  ${thinScrollbar}

  @media (max-width: 860px) {
    height: auto;
    overflow-y: visible;
  }
`;
