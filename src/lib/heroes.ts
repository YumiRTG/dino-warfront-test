import { asset } from '@/lib/assets'

/** Basic launch roster — same heroes as Bestiary */
export type HeroInfo = {
  id: string
  name: string
  role: string
  img: string
  focus: string
  blurb: string
  tips: string[]
}

export const BASIC_HEROES: HeroInfo[] = [
  {
    id: 'nyra-vale',
    name: 'Nyra Vale',
    role: 'Commander',
    img: asset('hero-nyra.png'),
    focus: 'Leadership · Survival',
    blurb:
      'Main commander of the Dominion. Nyra holds the tribe together when the wild closes in — the face of your campaign and the heart of every early push.',
    tips: [
      'Unlock and level her early — she anchors your first squads.',
      'Pair with tanky dinos or infantry to keep her skills online.',
      'Story and web rewards revolve around her rise as commander.',
    ],
  },
  {
    id: 'alyssa-mey',
    name: 'Alyssa Mey',
    role: 'Hero',
    img: asset('hero-alyssa.png'),
    focus: 'Strike · Mobility',
    blurb:
      'A sharp frontline ally who thrives when the battle opens up. Alyssa turns clean openings into decisive kills for your pack.',
    tips: [
      'Great for aggressive campaign stages.',
      'Synergizes with fast troops and raptor-style beasts.',
      'Level her skills when you need more burst on tough nodes.',
    ],
  },
  {
    id: 'carina-vale',
    name: 'Carina Vale',
    role: 'Hero',
    img: asset('hero-carina.png'),
    focus: 'Support · Resilience',
    blurb:
      'Kin to the Vale line — steady under pressure. Carina helps the tribe endure long sieges and multi-wave fights.',
    tips: [
      'Useful when hospitals and heal cycles matter.',
      'Strong mid-roster pick for balanced armies.',
      'Keep her protected so support skills keep firing.',
    ],
  },
  {
    id: 'elara-veyn',
    name: 'Elara Veyn',
    role: 'Hero',
    img: asset('hero-elara.png'),
    focus: 'Control · Precision',
    blurb:
      'A calculated fighter who tips close fights. Elara rewards careful positioning and timed skill use.',
    tips: [
      'Excellent on stages that punish reckless pushes.',
      'Combine with shooters for layered damage.',
      'Upgrade when campaign difficulty spikes.',
    ],
  },
  {
    id: 'ronan',
    name: 'Ronan',
    role: 'Hero',
    img: asset('hero-ronan.png'),
    focus: 'Power · Frontline',
    blurb:
      'A heavy presence in the line. Ronan is built to hold ground while dinosaurs and troops tear through the rest.',
    tips: [
      'Anchor for infantry-heavy formations.',
      'Good when you need durability over pure speed.',
      'Invest when rival tribes hit harder mid-campaign.',
    ],
  },
  {
    id: 'kailina',
    name: 'Kailina',
    role: 'Hero',
    img: asset('hero-kailina.png'),
    focus: 'Wild bond · Versatility',
    blurb:
      'Closely tied to the prehistoric wild. Kailina shines when your dino roster is growing and you need flexible skill cover.',
    tips: [
      'Pairs well once you start taming stronger beasts.',
      'Flexible pick for mixed armies.',
      'Level her as your bestiary depth increases.',
    ],
  },
]

export function heroById(id: string) {
  return BASIC_HEROES.find((h) => h.id === id)
}
