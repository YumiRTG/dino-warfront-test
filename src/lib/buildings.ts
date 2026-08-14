import { asset } from '@/lib/assets'

export type BuildingInfo = {
  id: string
  name: string
  role: string
  img: string
  blurb: string
}

export const BASE_BUILDINGS: BuildingInfo[] = [
  {
    id: 'town-hall',
    name: 'Town Hall',
    role: 'Core HQ',
    img: asset('env-base.png'),
    blurb:
      'The heart of your dominion. Raising the Town Hall unlocks more build slots, higher power caps, and the next tier of your empire.',
  },
  {
    id: 'camps',
    name: 'Barracks & Camps',
    role: 'Army',
    img: asset('troop-infantry.png'),
    blurb:
      'Train Infantry, Riders and Shooters. Upgrade camps to push troop tiers and fill the battlefield with a full formation.',
  },
  {
    id: 'hospital',
    name: 'Hospital',
    role: 'Recovery',
    img: asset('feat-battle.png'),
    blurb:
      'Heal wounded troops after hard fights so your army is ready for the next campaign stage instead of starting from zero.',
  },
  {
    id: 'food',
    name: 'Farms & Food',
    role: 'Production',
    img: asset('res-food.png'),
    blurb:
      'Keeps the tribe fed. Food production runs offline — expand farms so growth never fully stops while you are away.',
  },
  {
    id: 'wood',
    name: 'Lumber yards',
    role: 'Production',
    img: asset('res-wood.png'),
    blurb:
      'Wood fuels construction. Chain lumber buildings so new halls, walls and camps go up without waiting on the map.',
  },
  {
    id: 'iron',
    name: 'Mines & Iron',
    role: 'Production',
    img: asset('res-iron.png'),
    blurb:
      'Iron feeds upgrades and heavier gear. Critical when troop tiers and base levels start climbing.',
  },
  {
    id: 'oil',
    name: 'Oil / Energy',
    role: 'Advanced',
    img: asset('res-oil.png'),
    blurb:
      'Late-game production for advanced systems. Secure oil nodes and buildings as rival tribes pressure the map.',
  },
  {
    id: 'amber',
    name: 'Amber vaults',
    role: 'Special',
    img: asset('res-amber.png'),
    blurb:
      'Amber is the rare spark of the wild. Store and spend it carefully for high-value progress.',
  },
  {
    id: 'research',
    name: 'Research / Tech',
    role: 'Power',
    img: asset('feat-techtree.png'),
    blurb:
      'Climb the tech tree to boost troops, economy and battle power — idle research keeps the empire advancing.',
  },
  {
    id: 'alliance',
    name: 'Alliance outpost',
    role: 'Social',
    img: asset('feat-alliance.png'),
    blurb:
      'Link with other tribes, trade gifts and defend territory together. Empires that stand alone rarely last.',
  },
]
