export default function GaugeBar({ value }: { value: number }) {
  return (
    <div className="gauge-track">
      <div className="gauge-fill" style={{ width: `${value}%` }} />
      <span className="gauge-label">{value}%</span>
    </div>
  )
}
