/** Public assets under Vite `base` (needed for GitHub Pages subpaths). */

const OPTIMIZED_ASSETS = new Set([
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

export function asset(path: string): string {
  const base = import.meta.env.BASE_URL || '/'
  const clean = path.replace(/^\//, '')
  const resolved = OPTIMIZED_ASSETS.has(clean)
    ? `optimized/${clean.replace(/\.png$/i, '.webp')}`
    : clean
  return `${base}${resolved}`
}
