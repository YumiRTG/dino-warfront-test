/** Public assets under Vite `base` (needed for GitHub Pages subpaths). */

const HOMEPAGE_OPTIMIZED_ASSETS = new Set([
  'banner-bg.png',
  'dino-tyranno.png',
  'dino-raptor.png',
  'dino-triceratops.png',
  'dino-dilo.png',
  'dino-stego.png',
  'dino-allo.png',
  'dino-ptera.png',
  'dino-dragon.png',
])

function shouldUseOptimizedAsset(path: string): boolean {
  return (
    import.meta.env.VITE_USE_OPTIMIZED_ASSETS === '1' &&
    HOMEPAGE_OPTIMIZED_ASSETS.has(path)
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
