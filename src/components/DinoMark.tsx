/** Clean T-Rex silhouette mark (no busy UI icons). */
export default function DinoMark({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 46c2 4 8 8 16 8 6 0 10-1 14-3 2 3 6 5 12 5 6 0 10-2 12-5v-2c-3 2-7 3-11 3-5 0-8-2-9-5 6-4 10-10 12-16 1-4 0-8-3-10-2-2-5-2-8-1 1-4-1-8-5-10-5-3-12-2-16 2-3 3-4 7-3 11-4 1-7 4-8 8-1 5 1 10 7 13zm8-18c1-3 3-5 6-6 4-2 8-1 10 2 3 3 2 7 0 10-3 5-7 9-13 12-4-2-6-5-5-10 1-3 1-6 2-8zm24 2c2 0 4 1 5 3 2 4-1 10-6 14-1-5 0-12 1-17z" />
      <path d="M14 52h4v6h-4zm8 2h4v6h-4zm20 0h4v6h-4zm8-1h4v6h-4z" opacity="0.85" />
    </svg>
  )
}
