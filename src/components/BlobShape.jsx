/**
 * BlobShape — organic SVG blob accent behind the hero canvas portrait.
 * Fills with a very light lime tint (+ a gold offset blob) and
 * slowly breathes via a CSS scale animation.
 */
export default function BlobShape({ zIndex = 3, mixBlendMode = "soft-light", opacity1 = 0.09, opacity2 = 0.07 }) {
  return (
    <>
      <style>{`
        @keyframes blob-breathe {
          0%   { transform: translate(-50%, -50%) scale(1)    rotate(0deg);   }
          33%  { transform: translate(-50%, -50%) scale(1.025) rotate(2deg);  }
          66%  { transform: translate(-50%, -50%) scale(1.015) rotate(-1.5deg); }
          100% { transform: translate(-50%, -50%) scale(1)    rotate(0deg);   }
        }
        @keyframes blob-breathe-gold {
          0%   { transform: translate(-50%, -50%) scale(1)    rotate(0deg);   }
          50%  { transform: translate(-50%, -50%) scale(1.03)  rotate(-2deg); }
          100% { transform: translate(-50%, -50%) scale(1)    rotate(0deg);   }
        }
      `}</style>

      {/* Primary lime blob — centred behind canvas portrait */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '60%',
          maxWidth: '640px',
          transform: 'translate(-50%, -50%) scale(1)',
          pointerEvents: 'none',
          zIndex,
          mixBlendMode,
          animation: 'blob-breathe 8s ease-in-out infinite',
          transformOrigin: '50% 50%',
          opacity: opacity1,
        }}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="rgb(212,255,61)"
          d="M44.5,-58.3C56.6,-48.7,64.4,-33.8,68.2,-17.7
             C72,1.5,71.7,21.9,63.8,38.5
             C55.9,55.2,40.2,68.2,22.4,73.6
             C4.7,79,-15.2,76.8,-32.2,68.1
             C-49.2,59.5,-63.4,44.4,-69.9,26.3
             C-76.5,8.3,-75.5,-12.7,-67.1,-29.6
             C-58.7,-46.5,-43,-59.3,-26.4,-67.7
             C-9.8,-76.1,7.8,-80.2,24.1,-74.5
             C40.3,-68.7,32.4,-67.8,44.5,-58.3Z"
          transform="translate(100 100)"
        />
      </svg>

      {/* Secondary gold offset blob — slightly shifted */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '58%',
          top: '42%',
          width: '38%',
          maxWidth: '380px',
          transform: 'translate(-50%, -50%) scale(1)',
          pointerEvents: 'none',
          zIndex,
          mixBlendMode,
          animation: 'blob-breathe-gold 11s ease-in-out infinite',
          transformOrigin: '50% 50%',
          opacity: opacity2,
        }}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="rgb(201,168,76)"
          d="M38.2,-50.8C48.4,-40.2,54.9,-27,58.6,-12.3
             C62.3,2.4,63.2,18.6,57.4,32.4
             C51.6,46.2,39,57.6,24.5,63.8
             C9.9,70,-6.5,71,-21.6,66.3
             C-36.7,61.6,-50.5,51.3,-58.9,37.1
             C-67.2,22.9,-70.2,4.8,-66.5,-11.5
             C-62.8,-27.9,-52.4,-42.5,-39.3,-52.6
             C-26.1,-62.7,-10.4,-68.4,3.2,-72.1
             C16.8,-75.9,28,-61.5,38.2,-50.8Z"
          transform="translate(100 100)"
        />
      </svg>
    </>
  );
}
