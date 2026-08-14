/** Public assets under Vite `base` (needed for GitHub Pages subpath /app/). */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL || '/'
  const clean = path.replace(/^\//, '')
  return `${base}${clean}`
}
