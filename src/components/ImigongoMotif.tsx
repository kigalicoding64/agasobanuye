export function ImigongoStrip({ height = 8 }: { height?: number }) {
  const cell = 28;
  const cells = 24;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${cell * cells} ${cell}`} preserveAspectRatio="none" style={{ display: "block" }}>
      {Array.from({ length: cells }).map((_, i) => (
        <polygon
          key={i}
          points={`${i * cell},${cell} ${i * cell + cell / 2},0 ${i * cell + cell},${cell}`}
          fill={i % 2 === 0 ? "#E8A33D" : "#C1432D"}
        />
      ))}
    </svg>
  );
}

export function ImigongoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <polygon points="20,2 38,38 2,38" fill="#E8A33D" />
      <polygon points="20,14 28,30 12,30" fill="#15110D" />
    </svg>
  );
}
