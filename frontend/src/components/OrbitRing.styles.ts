import styled, { css, keyframes } from 'styled-components'
import type { RobotPhase } from './LLMModel'

// 3개 링이 서로 다른 각도로 기울어진 채(rotateX 고정) Z축으로 계속 회전 —
// 토성 고리처럼 보이는 3D 궤도 효과. rotateY 값만 링마다 다르게 줘서 기울기를 분산시킨다.
const spinTilt = (rotateY: number) => keyframes`
  0% { transform: rotateX(66deg) rotateY(${rotateY}deg) rotateZ(0deg); }
  100% { transform: rotateX(66deg) rotateY(${rotateY}deg) rotateZ(360deg); }
`
const RING_SPIN = [spinTilt(0), spinTilt(60), spinTilt(-60)] as const
const RING_BASE_SEC = [9, 13, 16] as const

// 활동 중(thinking/tool)이면 세 링 다 같은 속도(4.2s)로 빨라지고, error는 더 급하게(2.8s) 흔들리듯 돈다.
const ringDuration = (baseSec: number, state?: RobotPhase) => {
  if (state === 'error') return '2.8s'
  if (state === 'thinking' || state === 'tool') return '4.2s'
  return `${baseSec}s`
}

// 점 하나가 중심에서 radius만큼 떨어진 원을 그리며 돈다. radius는 컨테이너 크기에 따라 달라지므로
// 매번 새 keyframes를 만들어야 해서 컴포넌트 쪽에서 useMemo로 감싸 쓴다.
export const createDotOrbit = (radius: number) => keyframes`
  0% { transform: translate(-50%, -50%) rotate(0deg) translateX(${radius}px) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg) translateX(${radius}px) rotate(-360deg); }
`
const DOT_ORBIT_SEC = [4, 5, 3] as const

const glow = keyframes`
  0%, 100% { opacity: 0.5; box-shadow: 0 0 2px currentColor; }
  50% { opacity: 1; box-shadow: 0 0 8px 2px currentColor; }
`

// box-shadow 리페인트를 줄이려고 트랜지션을 20fps로 계단화(steps())한다 — GPU 부담 감소.
const STEP_FPS = 20
const steppedOrbit = (sec: number) => `steps(${Math.round(sec * STEP_FPS)})`

type Ring = 1 | 2 | 3

const RING_COLOR: Record<Ring, (state?: RobotPhase) => string> = {
  1: (state) =>
    state === 'tool'
      ? 'rgba(255, 214, 51, 0.95)'
      : state === 'error'
        ? 'rgba(255, 107, 107, 0.95)'
        : state === 'thinking'
          ? 'rgba(124, 147, 255, 0.9)'
          : 'rgba(251, 232, 63, 0.91)',
  2: (state) =>
    state === 'tool'
      ? 'rgba(251, 232, 63, 0.85)'
      : state === 'error'
        ? 'rgba(255, 82, 82, 0.85)'
        : state === 'thinking'
          ? 'rgba(91, 127, 255, 0.85)'
          : 'rgba(251, 194, 235, 0.82)',
  3: (state) =>
    state === 'tool'
      ? 'rgba(255, 193, 7, 0.85)'
      : state === 'error'
        ? 'rgba(229, 57, 53, 0.85)'
        : state === 'thinking'
          ? 'rgba(69, 104, 224, 0.85)'
          : 'rgba(105, 241, 235, 0.93)',
}

const DOT_COLOR: Record<Ring, (state?: RobotPhase) => { bg: string; fg: string }> = {
  1: (state) =>
    state === 'tool'
      ? { bg: '#ffd633', fg: 'rgba(255, 214, 51, 0.9)' }
      : state === 'error'
        ? { bg: '#ff6b6b', fg: 'rgba(255, 107, 107, 0.9)' }
        : state === 'thinking'
          ? { bg: '#7c93ff', fg: 'rgba(124, 147, 255, 0.9)' }
          : { bg: '#fbee3f', fg: '#fbee3faf' },
  2: (state) =>
    state === 'tool'
      ? { bg: '#fbe83f', fg: 'rgba(251, 232, 63, 0.85)' }
      : state === 'error'
        ? { bg: '#ff5252', fg: 'rgba(255, 82, 82, 0.85)' }
        : state === 'thinking'
          ? { bg: '#5b7fff', fg: 'rgba(91, 127, 255, 0.85)' }
          : { bg: '#a18cd1', fg: 'rgba(251, 194, 235, 0.77)' },
  3: (state) =>
    state === 'tool'
      ? { bg: '#ffc107', fg: 'rgba(255, 193, 7, 0.85)' }
      : state === 'error'
        ? { bg: '#e53935', fg: 'rgba(229, 57, 53, 0.85)' }
        : state === 'thinking'
          ? { bg: '#4568e0', fg: 'rgba(69, 104, 224, 0.85)' }
          : { bg: '#ffffff', fg: 'rgba(132, 250, 175, 0.79)' },
}

export const Container = styled.div<{ $size: number; $clickable: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  perspective: 1000px;
  perspective-origin: center center;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  ${(p) => p.$clickable && css`cursor: pointer;`}
`

// 중앙 콘텐츠(로봇/텍스트/뭐든) 슬롯 — 궤도 링보다 위에 그려지도록 z-index를 준다.
export const Center = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const OrbitWrapper = styled.div<{ $size: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${(p) => p.$size - 15}px;
  height: ${(p) => p.$size - 15}px;
  transform-style: preserve-3d;
  pointer-events: none;
`

export const RingRotate = styled.div<{ $ring: Ring; $state?: RobotPhase }>`
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  will-change: transform;
  animation: ${(p) => RING_SPIN[p.$ring - 1]} ${(p) => ringDuration(RING_BASE_SEC[p.$ring - 1], p.$state)} linear
    infinite;
`

export const RingLine = styled.div<{ $ring: Ring; $borderWidth: number; $state?: RobotPhase }>`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border-style: solid;
  border-width: ${(p) => p.$borderWidth}px;
  border-color: ${(p) => RING_COLOR[p.$ring](p.$state)};
`

export const DotOrbit = styled.div<{ $ring: Ring; $anim: ReturnType<typeof createDotOrbit> }>`
  position: absolute;
  top: 50%;
  left: 50%;
  will-change: transform;
  animation: ${(p) => p.$anim} ${(p) => DOT_ORBIT_SEC[p.$ring - 1]}s
    ${(p) => steppedOrbit(DOT_ORBIT_SEC[p.$ring - 1])} infinite;
`

export const Dot = styled.div<{ $ring: Ring; $state?: RobotPhase }>`
  position: absolute;
  width: 3px;
  height: 3px;
  margin: -1px 0 0 -1px;
  border-radius: 50%;
  animation: ${glow} 2s ${steppedOrbit(2)} infinite;
  background: ${(p) => DOT_COLOR[p.$ring](p.$state).bg};
  color: ${(p) => DOT_COLOR[p.$ring](p.$state).fg};
  ${(p) => p.$ring === 1 && css`animation-delay: 0.6s;`}
`
