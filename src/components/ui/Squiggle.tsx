/**
 * Hand-drawn underline accent — an irregular ink stroke (not a clean CSS rule)
 * to add a human, illustrated touch under hero words.
 */
export function Squiggle({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M2 11C40 4 70 14 104 9C140 4 168 13 205 8C238 4 268 12 298 6"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
