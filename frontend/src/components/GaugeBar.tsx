import styled from 'styled-components'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11px;
  color: ${(p) => p.theme.color.ink3};
`

const Track = styled.div`
  position: relative;
  background: ${(p) => p.theme.border.line};
  border-radius: ${(p) => p.theme.radius.pill};
  height: 5px;
  overflow: hidden;
`

const Fill = styled.div<{ $value: number }>`
  background: ${(p) => p.theme.gradient.gaugeFill};
  height: 100%;
  width: ${(p) => p.$value}%;
  transition: width 0.3s;
`

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
