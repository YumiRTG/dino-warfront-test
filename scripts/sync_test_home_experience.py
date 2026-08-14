from __future__ import annotations

from pathlib import Path
from urllib.request import Request, urlopen

SOURCE = 'https://raw.githubusercontent.com/YumiRTG/app/main/src/pages/HomePage.tsx'
TARGET = Path('src/pages/HomePage.tsx')

request = Request(SOURCE, headers={'User-Agent': 'dino-warfront-test-home-sync'})
with urlopen(request, timeout=30) as response:
    home = response.read().decode('utf-8')


def replace_once(old: str, new: str) -> None:
    global home
    if old not in home:
        raise SystemExit(f'Expected baseline fragment not found:\n{old[:220]}')
    home = home.replace(old, new, 1)


replace_once(
    "import { Link } from 'react-router'",
    "import { useState } from 'react'\nimport { Link } from 'react-router'",
)

replace_once(
    "import WarRoom from '@/sections/WarRoom'",
    "import WarRoom from '@/sections/WarRoom'\nimport { HomeCinematicSequence, HomeExperienceFx, HomeIntro } from '@/components/HomeExperience'\nimport './HomePage.css'",
)

replace_once(
    "  const motionRef = usePageMotion()\n\n  return (",
    "  const motionRef = usePageMotion()\n  const [introToken, setIntroToken] = useState(0)\n\n  return (",
)

replace_once(
    '    <div ref={motionRef} className="relative">',
    '    <div ref={motionRef} className="relative home-exp-home">\n      <HomeExperienceFx />\n      <HomeIntro replayToken={introToken} />',
)

replace_once(
    '<section className="relative min-h-[100svh] overflow-hidden">',
    '<section className="relative min-h-[100svh] overflow-hidden home-exp-hero">',
)

replace_once(
    "          draggable={false}\n        />",
    "          draggable={false}\n        />\n        <div className=\"home-exp-hero-grid\" aria-hidden />\n        <div className=\"home-exp-hero-sweep\" aria-hidden />\n        <div className=\"home-exp-hero-pulse\" aria-hidden />",
)

replace_once(
    'className="display-xl text-white title-glow drop-shadow-[0_4px_40px_rgba(0,0,0,0.65)] !text-[clamp(2.75rem,9vw,6.5rem)]"',
    'className="display-xl text-white title-glow home-exp-title drop-shadow-[0_4px_40px_rgba(0,0,0,0.65)] !text-[clamp(2.75rem,9vw,6.5rem)]"',
)

scroll_cue = '''        <div
          data-hero
          data-hero-delay="0.55"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
        >'''
replace_once(
    scroll_cue,
    '''        <button
          type="button"
          className="home-exp-replay"
          onClick={() => setIntroToken((value) => value + 1)}
        >
          Replay intro
        </button>

''' + scroll_cue,
)

replace_once(
    '      <WarRoom />',
    '      <WarRoom />\n\n      {/* Cinematic bridge: original homepage continues below unchanged. */}\n      <HomeCinematicSequence />',
)

replace_once(
    'className="media-frame relative aspect-[4/5] overflow-hidden group dino-card-pulse bg-[#0a0810]"',
    'className="media-frame relative aspect-[4/5] overflow-hidden group dino-card-pulse home-exp-apex-card bg-[#0a0810]"',
)

replace_once(
    'className="relative overflow-hidden rounded-sm border border-[var(--gold)]/25 px-6 py-14 md:px-16 md:py-20"',
    'className="relative overflow-hidden home-exp-final-cta rounded-sm border border-[var(--gold)]/25 px-6 py-14 md:px-16 md:py-20"',
)

TARGET.write_text(home, encoding='utf-8')
print(f'Wrote {TARGET} from production baseline with cinematic experience additions.')
