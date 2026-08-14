/** Public assets under Vite `base` (needed for GitHub Pages subpaths). */

const OPTIMIZED_TOP_LEVEL_PREFIXES = [
  'dino-',
  'campaign-',
  'env-',
  'feat-',
  'hero-',
  'icon-',
  'res-',
  'troop-',
]

function shouldUseOptimizedAsset(path: string): boolean {
  if (import.meta.env.VITE_USE_OPTIMIZED_ASSETS !== '1') return false
  if (path.includes('/')) return false
  if (!path.toLowerCase().endsWith('.png')) return false

  // The fullscreen hero is already small and is kept untouched for maximum quality.
  if (path === 'hero-poster.png') return false

  return (
    path === 'banner-bg.png' ||
    path === 'ui-hero-screen.png' ||
    OPTIMIZED_TOP_LEVEL_PREFIXES.some((prefix) => path.startsWith(prefix))
  )
}

export function asset(path: string): string {
  const base = import.meta.env.BASE_URL || '/'
  const clean = path.replace(/^\//, '')
  const resolved = shouldUseOptimizedAsset(clean)
    ? `optimized/${clean.replace(/\.png$/i, '.webp')}`
    : clean
  return `${base}${resolved}`
}
