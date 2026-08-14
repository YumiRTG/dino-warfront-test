/**
 * Vercel Serverless Function — one alliance and its roster, by alliance id.
 *
 * The alliance id is not a credential, so it stays readable in the URL. The
 * member Account IDs are, so each roster row carries an opaque profile token
 * instead. See _token.js.
 */

import { encodeUid } from './_token.js'
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

const ROLE_LABEL = {
  leader: 'Leader', r5: 'Leader', r4: 'Officer', officer: 'Officer',
  r3: 'Veteran', r2: 'Member', r1: 'Recruit', member: 'Member',
}

function avatarId(raw, seed) {
  const d = typeof raw === 'string' ? raw.replace(/\D+/g, '') : String(raw ?? '')
  const n = Number(d)
  if (Number.isFinite(n) && n >= 1 && n <= 10) return Math.trunc(n)
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return (hash % 10) + 1
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`)

  const id = str(req.query?.id)
  if (!id) { res.status(404).json({ error: 'not-found' }); return }

  try {
    const db = await getDb()
    const snap = await getDoc(doc(db, 'alliances', id))
    if (!snap.exists()) { res.status(404).json({ error: 'not-found' }); return }
    const x = snap.data()

    let members = []
    try {
      const ms = await getDocs(collection(db, 'alliances', id, 'members'))
      members = ms.docs
        .map((m) => {
          const d = m.data()
          return {
            token: encodeUid(m.id),
            name: str(d.displayName) || 'Commander',
            role: ROLE_LABEL[str(d.role).toLowerCase()] ?? 'Member',
            power: num(d.powerScore),
            techContributed: num(d.techContributed),
            avatar: avatarId(d.avatarIconId, m.id),
          }
        })
        .sort((a, b) => b.power - a.power)
    } catch {
      members = []
    }

    res.status(200).json({
      id: snap.id,
      name: str(x.name) || 'Unnamed alliance',
      tag: str(x.tag) || '???',
      color: /^#[0-9a-f]{6}$/i.test(str(x.territoryColor)) ? x.territoryColor : '#f0c14d',
      level: Math.max(1, num(x.level)),
      exp: num(x.allianceExp),
      power: num(x.totalPower),
      memberCount: num(x.memberCount) || members.length,
      description: str(x.description),
      members,
    })
  } catch (err) {
    res.status(200).json({ error: String(err?.code || err?.message || err) })
  }
}
