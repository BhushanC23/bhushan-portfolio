export default function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] will-change-transform"
      style={{
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 0)`,
        backgroundSize: '4px 4px',
      }}
      aria-hidden="true"
    />
  );
}
