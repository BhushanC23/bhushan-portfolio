/**
 * TopographicBackground — full-bleed SVG contour lines
 * Mimics elevation-map topographic lines, thin & organic.
 * Placed behind hero canvas as a fixed/absolute non-interactive layer.
 */
export default function TopographicBackground({ stroke = "var(--line-subtle)", opacity = 0.2, zIndex = 3, mixBlendMode = "normal" }) {
  // 10 flowing bezier contour lines across a 1920x1080 viewBox
  // Each path is hand-spaced vertically and flows with organic bezier curves
  const contourPaths = [
    // Bottom-most contour — lowest elevation
    "M-100,980 C200,940 400,1020 700,960 S1100,920 1400,980 S1700,1020 2020,960",
    "M-100,900 C150,860 380,940 680,875 S1050,840 1350,900 S1680,945 2020,880",
    "M-100,810 C180,775 420,855 720,790 S1080,755 1370,820 S1660,860 2020,795",
    // Mid contours
    "M-100,680 C220,645 460,720 750,660 S1100,625 1390,690 S1660,730 2020,665",
    "M-100,560 C190,530 430,600 730,545 S1090,510 1380,570 S1660,608 2020,548",
    "M-100,450 C250,420 490,495 780,435 S1120,400 1400,460 S1660,495 2020,438",
    // Upper contours — mountain peaks
    "M-100,340 C280,310 520,385 800,328 S1140,295 1420,355 S1670,388 2020,332",
    "M-100,235 C310,205 560,280 840,222 S1160,192 1440,252 S1678,285 2020,228",
    "M-100,140 C340,112 590,182 870,126 S1180,98 1460,158 S1685,190 2020,135",
    // Top-most contour — highest elevation
    "M-100,52 C380,26 630,94 905,40 S1198,14 1478,72 S1690,102 2020,48",
  ];

  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity,
        mixBlendMode,
        pointerEvents: 'none',
        zIndex,
      }}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        fill="none"
        stroke="var(--line-subtle)"
        strokeWidth="1"
        strokeLinecap="round"
      >
        {contourPaths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}
