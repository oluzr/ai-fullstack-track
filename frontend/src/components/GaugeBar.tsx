import { Wrap, Meta, Track, Fill } from './GaugeBar.styles'

export default function GaugeBar({ value }: { value: number }) {
  return (
    <Wrap>
      <Meta>
        <span>이해도</span>
        <span>{value}%</span>
      </Meta>
      <Track>
        <Fill $value={value} />
      </Track>
    </Wrap>
  )
}
