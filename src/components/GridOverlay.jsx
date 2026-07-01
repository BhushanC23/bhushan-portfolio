/**
 * GridOverlay — premium Awwwards-style architectural vertical guidelines.
 * Spans from top to bottom of the website, giving a clean structural grid.
 */
export default function GridOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9990, // just behind the custom cursor (10000) and preloader
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 4%', // matches layout containers padding
      }}
    >
      {/* 5 vertical guidelines */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          style={{
            width: '1px',
            height: '100%',
            borderLeft: '1px dashed var(--line-subtle)',
            opacity: 0.08,
            transition: 'border-color 0.4s ease',
          }}
        />
      ))}
    </div>
  );
}
