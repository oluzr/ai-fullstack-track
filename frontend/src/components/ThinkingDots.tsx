import { Dots, Dot } from './ThinkingDots.styles'

export default function ThinkingDots() {
  return (
    <Dots role="status" aria-label="생각하는 중">
      <Dot $delay={0} />
      <Dot $delay={0.15} />
      <Dot $delay={0.3} />
    </Dots>
  )
}
