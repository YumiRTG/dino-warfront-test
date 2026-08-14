/**
 * Vercel Serverless Function — Support chat via xAI (Grok)
 * Env: XAI_API_KEY (Vercel → Settings → Environment Variables)
 *
 * Uses ESM export (package.json has "type": "module").
 */

const SYSTEM_PROMPT = `You are Dominion Support, the helpful assistant for the mobile game Dino Dominion and its official website.

Tone: friendly, short, clear. English by default; reply in German if the user writes German.

You help with:
- Android APK download & install (large file, Wi‑Fi recommended, unknown sources)
- Account ID login on the website (no password; ID from game Settings; commander name loads from cloud)
- Daily login rewards & roulette (speed ups; sync to game inventory when the app is open)
- Game basics: build base, heroes (Nyra Vale), dinos, troops, campaign, alliances
- Community: Discord/Forum may be "coming soon" if not linked yet

Rules:
- Do NOT invent store links, official Discord invites, or account passwords.
- Do NOT claim you can create game accounts on the website.
- Keep answers under ~120 words unless the user asks for detail.
- If unsure, say so and suggest Download, Play, Features, or Bestiary pages.
`

function sendJson(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.end(JSON.stringify(data))
}

export default async function handler(req, res) {
  try {
    // CORS preflight
    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      return res.end()
    }

    if (req.method !== 'POST') {
      return sendJson(res, 405, { error: 'Method not allowed' })
    }

    const apiKey = process.env.XAI_API_KEY
    if (!apiKey) {
      return sendJson(res, 503, {
        error: 'AI not configured. Set XAI_API_KEY in Vercel Environment Variables and redeploy.',
        code: 'NO_API_KEY',
      })
    }

    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body || '{}')
      } catch {
        return sendJson(res, 400, { error: 'Invalid JSON body' })
      }
    }
    if (!body || typeof body !== 'object') body = {}

    const incoming = Array.isArray(body.messages) ? body.messages : []
    const messages = incoming
      .filter(
        (m) =>
          m &&
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string' &&
          m.content.trim().length > 0
      )
      .slice(-12)
      .map((m) => ({
        role: m.role,
        content: String(m.content).trim().slice(0, 2000),
      }))

    if (messages.length === 0) {
      return sendJson(res, 400, { error: 'No messages' })
    }

    if (messages[messages.length - 1].role !== 'user') {
      return sendJson(res, 400, { error: 'Last message must be from user' })
    }

    const upstream = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-4.5',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.6,
        max_tokens: 450,
      }),
    })

    const data = await upstream.json().catch(() => ({}))

    if (!upstream.ok) {
      const msg =
        (data && data.error && (data.error.message || data.error)) ||
        `xAI error ${upstream.status}`
      console.error('[api/chat] xAI error', upstream.status, msg)
      return sendJson(res, 502, {
        error: String(msg),
        code: 'XAI_ERROR',
        status: upstream.status,
      })
    }

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      'Sorry, I could not generate a reply. Please try again.'

    return sendJson(res, 200, { reply })
  } catch (err) {
    console.error('[api/chat] crash', err)
    return sendJson(res, 500, {
      error: err?.message || 'Server error',
      code: 'SERVER_ERROR',
    })
  }
}
