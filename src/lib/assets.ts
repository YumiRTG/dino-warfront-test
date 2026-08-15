/** Public assets under Vite `base` (needed for GitHub Pages subpaths). */

const HOMEPAGE_OPTIMIZED_ASSETS = new Set([
  'banner-bg.png',
  'hero-nyra.png',
  'dino-tyranno.png',
  'dino-raptor.png',
  'dino-triceratops.png',
  'dino-dilo.png',
  'dino-stego.png',
  'dino-allo.png',
  'dino-ptera.png',
  'dino-dragon.png',
])

const CACHE_BUSTED_ASSETS: Record<string, string> = {
  'promo/partner-system-promo.jpg': 'promo/partner-system-promo-v2.jpg',
}

function shouldUseOptimizedAsset(path: string): boolean {
  return (
    import.meta.env.VITE_USE_OPTIMIZED_ASSETS === '1' &&
    HOMEPAGE_OPTIMIZED_ASSETS.has(path)
  )
}

export function asset(path: string): string {
  const base = import.meta.env.BASE_URL || '/'
  const clean = path.replace(/^\//, '')
  const cacheBusted = CACHE_BUSTED_ASSETS[clean] ?? clean
  const resolved = shouldUseOptimizedAsset(cacheBusted)
    ? `optimized/${cacheBusted.replace(/\.png$/i, '.webp')}`
    : cacheBusted
  return `${base}${resolved}`
}
