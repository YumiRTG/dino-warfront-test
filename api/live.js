/**
 * Vercel Serverless Function — all live game data for the website, in one
 * response, cached at the edge.
 *
 * Why this exists: every visitor used to hit Firestore directly. A refresh, a
 * crawler or someone holding F5 turned straight into billable reads. Now the
 * CDN answers instead, and Firestore is touched at most once per CACHE_SECONDS
 * for the whole world, no matter how many people load the page.
 *
 * s-maxage tells Vercel's CDN how long to serve the cached copy.
 * stale-while-revalidate lets it keep serving the old copy while it refreshes
 * in the background, so nobody ever waits on Firestore.
 */

import { encodeUid } from './_token.js'
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import {
  collection,
  count,
  getAggregateFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  sum,
} from 'firebase/firestore'

const CACHE_SECONDS = 1200 // 20 minutes
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
      const { getFirestore } = await import('firebase/firestore')
      return getFirestore(app)
    })()
  }
  return dbPromise
}

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : Number(v) || 0)
const str = (v) => (typeof v === 'string' ? v.trim() : '')

function avatarId(raw, seed) {
  const digits = typeof raw === 'string' ? raw.replace(/\D+/g, '') : String(raw ?? '')
  const n = Number(digits)
  if (Number.isFinite(n) && n >= 1 && n <= 10) return Math.trunc(n)
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return (hash % 10) + 1
}

const RANK_FIELDS = [
  { id: 'power', field: 'totalScore' },
  { id: 'hero', field: 'heroPowerBest', detail: 'heroBestName' },
  { id: 'townhall', field: 'townHallLevel' },
  { id: 'kills', field: 'troopKills' },
]

async function topBy(db, field, detail, n) {
  const snap = await getDocs(
    query(collection(db, 'players'), orderBy(field, 'desc'), limit(n)),
  )
  return snap.docs
    .map((d) => {
      const x = d.data()
      return {
        // Never the raw Account ID: that is the website login credential.
        token: encodeUid(d.id),
        name: str(x.displayName) || 'Unnamed commander',
        value: num(x[field]),
        detail: detail ? str(x[detail]) || undefined : undefined,
        avatar: avatarId(x.avatarIconId, d.id),
      }
    })
    .filter((e) => e.value > 0)
}

async function ladder(db, col, n) {
  const snap = await getDocs(query(collection(db, col), orderBy('points', 'desc'), limit(n)))
  return snap.docs.map((d) => {
    const x = d.data()
    const ids = Array.isArray(x.heroIds) ? x.heroIds : []
    const names = Array.isArray(x.heroNames) ? x.heroNames : []
    const powers = Array.isArray(x.heroPower) ? x.heroPower : []
    return {
      token: encodeUid(d.id),
      name: str(x.name) || 'Commander',
      points: num(x.points),
      wins: num(x.wins),
      losses: num(x.losses),
      defensePower: num(x.defensePower) || num(x.totalPower),
      isBot: x.isBot === true,
      avatar: avatarId(x.avatarIconId, d.id),
      heroes: ids.map((id, i) => ({
        id: String(id),
        name: str(names[i]) || String(id),
        power: num(powers[i]),
      })),
      teamPower: Array.isArray(x.teamPower) ? x.teamPower.map(num) : [],
    }
  })
}

export default async function handler(req, res) {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
  )

  try {
    const db = await getDb()
    const players = collection(db, 'players')

    // count() and sum() must be separate queries. Combined into one aggregation,
    // Firestore restricts the whole result to documents that have the summed
    // field, so the player count silently dropped from 13 to 9 because four
    // accounts have never recorded a troopKills value.
    const [playerCount, killsAgg, allianceAgg, topDoc, seenDoc, ranks, arena, teamArena, alliances] =
      await Promise.all([
        getAggregateFromServer(players, { n: count() }),
        getAggregateFromServer(players, { kills: sum('troopKills') }),
        getAggregateFromServer(collection(db, 'alliances'), { n: count() }),
        getDocs(query(players, orderBy('totalScore', 'desc'), limit(1))),
        getDocs(query(players, orderBy('lastOnline', 'desc'), limit(1))),
        Promise.all(RANK_FIELDS.map((c) => topBy(db, c.field, c.detail, 10))),
        ladder(db, 'arena', 5),
        ladder(db, 'teamarena', 4),
        getDocs(query(collection(db, 'alliances'), orderBy('totalPower', 'desc'), limit(6))),
      ])

    const top = topDoc.docs[0]?.data()
    const seenAt = seenDoc.docs[0]?.data()?.lastOnline?.seconds

    res.status(200).json({
      generatedAt: Date.now(),
      pulse: {
        commanders: playerCount.data().n,
        alliances: allianceAgg.data().n,
        troopKills: num(killsAgg.data().kills),
        topPower: Math.max(num(top?.totalScore), num(top?.powerScore)),
        lastSeenMinutes: seenAt
          ? Math.max(0, Math.round((Date.now() - seenAt * 1000) / 60000))
          : null,
      },
      ranks: Object.fromEntries(RANK_FIELDS.map((c, i) => [c.id, ranks[i]])),
      arena,
      teamArena,
      alliances: alliances.docs.map((d) => {
        const x = d.data()
        return {
          id: d.id,
          name: str(x.name) || 'Unnamed',
          tag: str(x.tag) || '???',
          power: num(x.totalPower),
          members: num(x.memberCount),
          level: Math.max(1, num(x.level)),
          exp: num(x.allianceExp),
          color: /^#[0-9a-f]{6}$/i.test(str(x.territoryColor)) ? x.territoryColor : '#f0c14d',
        }
      }),
    })
  } catch (err) {
    // Never let the front page fail over standings. The client falls back to
    // hiding those sections when this errors.
    res.status(200).json({ error: String(err?.code || err?.message || err) })
  }
}
