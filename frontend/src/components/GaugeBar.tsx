import styled from 'styled-components'

const Track = styled.div`
  position: relative;
  background: ${(p) => p.theme.colors.secondary};
  border-radius: 999px;
  height: 20px;
  overflow: hidden;
  margin-top: 0.5rem;
`

const Fill = styled.div<{ $value: number }>`
  background: ${(p) => p.theme.colors.primary};
  height: 100%;
  width: ${(p) => p.$value}%;
  transition: width 0.3s;
`

const Label = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
`

export default function GaugeBar({ value }: { value: number }) {
  return (
    <Track>
      <Fill $value={value} />
      <Label>{value}%</Label>
    </Track>
  )
}
