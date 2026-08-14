/**
 * Vercel Serverless Function — one commander profile, by opaque token.
 *
 * The browser used to fetch players/{accountId} directly, which meant the
 * Account ID sat in the URL and in the page. That ID is the website's login
 * credential, so this now goes through the server: the token is decrypted
 * here, Firestore is queried here, and the response contains no Account ID.
 */

import { decodeToken, encodeUid } from './_token.js'
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore'

const CACHE_SECONDS = 300
const STALE_SECONDS = 600

const firebaseConfig = {
  apiKey: 'AIzaSyA67N3HcTbJT1f-I3gGelYuwhSxSa85M38',
  authDomain: 'dinodominion-289b0.firebaseapp.com',
  projectId: 'dinodominion-289b0',
  storageBucket: 'dinodominion-289b0.firebasestorage.app',
  messagingSenderId: '143942581338',
  appId: '1:143942581338:android:cdf4c0bb076c21550e2c63',
}

let dbPromise = null
async function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
      await signInAnonymously(getAuth(app))
      return getFirestore(app)
    })()
  }
  return dbPromise
}

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : Number(v) || 0)
const str = (v) => (typeof v === 'string' ? v.trim() : '')

const BUILDING_EN = {
  'Allianz-Gebäude': 'Alliance Hall', Aussenzaun: 'Outer Fence', Eisenmine: 'Iron Mine',
  Farm: 'Farm', Forschung: 'Research Lab', Heldenaltar: 'Hero Altar',
  'Holzfäller': 'Lumber Camp', Hospital: 'Hospital', Rathaus: 'Town Hall',
  Kaserne: 'Barracks', Lager: 'Storage', 'Ölquelle': 'Oil Well', Bohrturm: 'Oil Derrick',
  Wachturm: 'Watchtower', Markt: 'Market', Marktplatz: 'Market', Arena: 'Arena',
  Schmiede: 'Forge', 'Übungsplatz': 'Training Ground', Bernsteinmine: 'Amber Mine',
  Truppenhalle: 'Troop Hall', 'Lager – Infanterie': 'Infantry Camp',
  'Lager - Infanterie': 'Infantry Camp', 'Lager – Schützen': 'Shooter Camp',
  'Lager - Schützen': 'Shooter Camp', 'Lager – Reiter': 'Rider Camp',
  'Lager - Reiter': 'Rider Camp', 'Sägewerk': 'Sawmill', Steinbruch: 'Quarry',
  Speicher: 'Warehouse', Wachposten: 'Guard Post', Turm: 'Tower', Stall: 'Stable',
  'Schießstand': 'Shooting Range',
}

const BRANCHES = [
  { key: 'inf', label: 'Infantry' },
  { key: 'sht', label: 'Shooters' },
  { key: 'rid', label: 'Riders' },
]

function parseTroops(raw) {
  let obj = {}
  if (typeof raw === 'string' && raw.trim()) { try { obj = JSON.parse(raw) } catch { obj = {} } }
  return BRANCHES.map((b) => {
    const tiers = Array.isArray(obj[b.key]) ? obj[b.key].map(num) : []
    return { key: b.key, label: b.label, tiers, total: tiers.reduce((a, c) => a + c, 0) }
  })
}

function parseResearch(raw) {
  const levels = typeof raw === 'string' && raw.trim()
    ? raw.split(',').map((s) => Math.max(0, Math.min(10, num(s))))
    : []
  return { levels, done: levels.reduce((a, c) => a + c, 0), max: levels.length * 10 }
}

function parseCity(raw) {
  let list = []
  if (typeof raw === 'string' && raw.trim()) {
    try { list = JSON.parse(raw).baseBuildings || [] } catch { list = [] }
  }
  const byName = new Map()
  for (const b of list) {
    const rawName = str(b?.name)
    if (!rawName) continue
    const name = BUILDING_EN[rawName] ?? rawName
    const level = num(b.lvl)
    const hit = byName.get(name)
    if (hit) { hit.count += 1; hit.level = Math.max(hit.level, level) }
    else byName.set(name, { name, level, count: 1 })
  }
  return {
    buildings: [...byName.values()].sort((a, b) => b.level - a.level || a.name.localeCompare(b.name)),
    total: list.length,
  }
}

const ROLE_LABEL = {
  leader: 'Leader', r5: 'Leader', r4: 'Officer', officer: 'Officer',
  r3: 'Veteran', r2: 'Member', r1: 'Recruit', member: 'Member',
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`)

  const uid = decodeToken(req.query?.token)
  if (!uid) { res.status(404).json({ error: 'not-found' }); return }

  try {
    const db = await getDb()
    const snap = await getDoc(doc(db, 'players', uid))
    if (!snap.exists()) { res.status(404).json({ error: 'not-found' }); return }

    const x = snap.data()
    const lastOnline = x.lastOnline?.seconds ? x.lastOnline.seconds * 1000 : null
    let seenLabel = null
    if (lastOnline) {
      const h = Math.round((Date.now() - lastOnline) / 3600000)
      seenLabel = h < 1 ? 'Seen just now' : h < 48 ? `Seen ${h} h ago` : `Seen ${Math.round(h / 24)} d ago`
    }

    let alliance = null
    const allianceId = str(x.allianceId)
    if (allianceId) {
      const a = await getDoc(doc(db, 'alliances', allianceId))
      if (a.exists()) {
        const ax = a.data()
        alliance = {
          id: a.id,
          name: str(ax.name) || 'Unnamed alliance',
          tag: str(ax.tag) || '???',
          color: /^#[0-9a-f]{6}$/i.test(str(ax.territoryColor)) ? ax.territoryColor : '#f0c14d',
        }
      }
    }

    res.status(200).json({
      // Deliberately no uid in this response.
      name: str(x.displayName) || 'Unnamed commander',
      avatar: (() => {
        const d = typeof x.avatarIconId === 'string' ? x.avatarIconId.replace(/\D+/g, '') : String(x.avatarIconId ?? '')
        const n = Number(d)
        if (Number.isFinite(n) && n >= 1 && n <= 10) return Math.trunc(n)
        let hash = 0
        for (let i = 0; i < uid.length; i++) hash = (hash * 31 + uid.charCodeAt(i)) >>> 0
        return (hash % 10) + 1
      })(),
      totalScore: num(x.totalScore) || num(x.powerScore),
      townHallLevel: num(x.townHallLevel),
      heroPowerBest: num(x.heroPowerBest),
      heroBestName: str(x.heroBestName),
      heroPowerTotal: num(x.heroPowerTotal),
      researchPower: num(x.researchPower),
      buildingPower: num(x.buildingPower),
      troopKills: num(x.troopKills),
      seenLabel,
      alliance,
      troops: parseTroops(x.troops),
      research: parseResearch(x.research),
      city: parseCity(x.buildings),
    })
  } catch (err) {
    res.status(200).json({ error: String(err?.code || err?.message || err) })
  }
}

/** Alliance roster, with member links as tokens rather than Account IDs. */
export async function rosterFor(db, allianceId) {
  const ms = await getDocs(collection(db, 'alliances', allianceId, 'members'))
  return ms.docs
    .map((m) => {
      const d = m.data()
      return {
        token: encodeUid(m.id),
        name: str(d.displayName) || 'Commander',
        role: ROLE_LABEL[str(d.role).toLowerCase()] ?? 'Member',
        power: num(d.powerScore),
        techContributed: num(d.techContributed),
        avatarIconId: d.avatarIconId ?? null,
      }
    })
    .sort((a, b) => b.power - a.power)
}
