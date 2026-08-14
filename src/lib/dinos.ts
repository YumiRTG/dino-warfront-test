import { asset } from '@/lib/assets'

/** Basic dino roster — simple facts only */
export type DinoInfo = {
  id: string
  name: string
  role: string
  img: string
  blurb: string
}

export const BASIC_DINOS: DinoInfo[] = [
  {
    id: 'tyrannosaurus',
    name: 'Tyrannosaurus',
    role: 'Apex attacker',
    img: asset('dino-tyranno.png'),
    blurb: 'Heavy hitter. High damage frontline beast for breaking tough stages.',
  },
  {
    id: 'velociraptor',
    name: 'Velociraptor',
    role: 'Fast striker',
    img: asset('dino-raptor.png'),
    blurb: 'Quick and sharp. Good for speed and flanking with agile squads.',
  },
  {
    id: 'triceratops',
    name: 'Triceratops',
    role: 'Tank',
    img: asset('dino-triceratops.png'),
    blurb: 'Tough shield. Holds the line while your army deals damage.',
  },
  {
    id: 'dilophosaurus',
    name: 'Dilophosaurus',
    role: 'Control',
    img: asset('dino-dilo.png'),
    blurb: 'Disruptive fighter. Useful when you need pressure and control in a fight.',
  },
  {
    id: 'stegosaurus',
    name: 'Stegosaurus',
    role: 'Defense',
    img: asset('dino-stego.png'),
    blurb: 'Sturdy defender. Helps absorb hits and protect weaker units.',
  },
  {
    id: 'allosaurus',
    name: 'Allosaurus',
    role: 'Balanced hunter',
    img: asset('dino-allo.png'),
    blurb: 'Solid all-rounder. Reliable damage without extreme strengths or weaknesses.',
  },
  {
    id: 'pterodactyl',
    name: 'Pterodactyl',
    role: 'Air / mobility',
    img: asset('dino-ptera.png'),
    blurb: 'Aerial threat. Brings mobility and pressure from above.',
  },
  {
    id: 'mammoth',
    name: 'Mammoth',
    role: 'Heavy support',
    img: asset('dino-mammoth.png'),
    blurb: 'Big and durable. Strong presence in long, grinding battles.',
  },
  {
    id: 'smilodon',
    name: 'Smilodon',
    role: 'Ambush',
    img: asset('dino-smilodon.png'),
    blurb: 'Fierce ambusher. Hits hard when you need a burst of raw power.',
  },
  {
    id: 'fire-dragon',
    name: 'Fire Dragon',
    role: 'Special power',
    img: asset('dino-dragon.png'),
    blurb: 'Rare apex creature. High-impact pick for late power spikes.',
  },
]
