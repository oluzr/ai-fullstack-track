import { useMemo, type KeyboardEvent, type ReactNode } from 'react'
import type { RobotPhase } from './LLMModel'
import {
  Container,
  Center,
  OrbitWrapper,
  RingRotate,
  RingLine,
  DotOrbit,
  Dot,
  createDotOrbit,
} from './OrbitRing.styles'

interface Props {
  // 궤도 중심에 넣을 콘텐츠. LLMModel(로봇) 뿐 아니라 텍스트, 아이콘 등 뭐든 올 수 있다.
  children?: ReactNode
  // 궤도 전체 지름(px). 링 3개의 반지름/두께가 여기서 파생된다.
  containerSize: number
  borderRing?: number
  // 지정하면 링/점 색상과 회전 속도가 그 상태에 맞춰 바뀐다 (thinking/tool → 빨라짐, error → 더 급하게).
  state?: RobotPhase
  onClick?: () => void
}

export default function OrbitRing({ children, containerSize, borderRing = 1.5, state, onClick }: Props) {
  const orbitRadius = useMemo(() => (containerSize - 15) / 2, [containerSize])
  const dotOrbitAnim = useMemo(() => createDotOrbit(orbitRadius), [orbitRadius])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!onClick) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <Container
      $size={containerSize}
      $clickable={!!onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
      onClick={onClick}
    >
      <Center>{children}</Center>

      {([1, 2, 3] as const).map((ring) => (
        <OrbitWrapper key={ring} $size={containerSize}>
          <RingRotate $ring={ring} $state={state}>
            <RingLine $ring={ring} $borderWidth={borderRing} $state={state} />
            <DotOrbit $ring={ring} $anim={dotOrbitAnim}>
              <Dot $ring={ring} $state={state} />
            </DotOrbit>
          </RingRotate>
        </OrbitWrapper>
      ))}
    </Container>
  )
}
