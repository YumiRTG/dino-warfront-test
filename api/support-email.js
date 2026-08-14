/**
 * Vercel Serverless — deliver support form to your inbox.
 *
 * Env (Production + Redeploy required):
 *   GMAIL_USER          e.g. andre.miethke74@gmail.com
 *   GMAIL_APP_PASSWORD  16-char Google App Password (not normal login password)
 *   SUPPORT_TO_EMAIL    optional, defaults to GMAIL_USER / hardcoded default
 *   RESEND_API_KEY      optional alternative
 */

import nodemailer from 'nodemailer'

const DEFAULT_TO = 'andre.miethke74@gmail.com'

function sendJson(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.end(JSON.stringify(data))
}

function parseBody(req) {
  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}')
    } catch {
      return null
    }
  }
  if (!body || typeof body !== 'object') return {}
  return body
}

function clean(str, max) {
  return String(str ?? '')
    .trim()
    .slice(0, max)
}

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function envStatus() {
  const gmailUser = Boolean(clean(process.env.GMAIL_USER, 120))
  const gmailPass = Boolean(clean(process.env.GMAIL_APP_PASSWORD, 120))
  const supportTo = Boolean(clean(process.env.SUPPORT_TO_EMAIL, 120))
  const resend = Boolean(clean(process.env.RESEND_API_KEY, 80))
  return {
    gmailUser,
    gmailPass,
    gmailReady: gmailUser && gmailPass,
    supportTo,
    resend,
  }
}

function buildText({ name, email, accountId, message, lastQuestion, chatSummary }) {
  const lines = [
    'New support request from the website chat',
    '========================================',
    '',
    `From name:  ${name || '(not given)'}`,
    `Reply-to:   ${email}`,
    `Account ID: ${accountId || '(not given)'}`,
    `Time (UTC): ${new Date().toISOString()}`,
    '',
    '--- Message ---',
    message,
    '',
  ]
  if (lastQuestion) lines.push('--- Last chat question ---', lastQuestion, '')
  if (chatSummary) lines.push('--- Recent chat ---', chatSummary, '')
  return lines.join('\n')
}

function getMailer() {
  // nodemailer CJS/ESM interop on Vercel
  const nm = nodemailer?.createTransport ? nodemailer : nodemailer?.default
  if (!nm?.createTransport) {
    throw new Error('nodemailer failed to load on server')
  }
  return nm
}

async function sendViaGmail({ to, replyTo, subject, text }) {
  const user = clean(process.env.GMAIL_USER, 120)
  const pass = clean(process.env.GMAIL_APP_PASSWORD, 120).replace(/\s+/g, '')

  if (!user || !pass) {
    return {
      ok: false,
      skip: true,
      error: !user && !pass
        ? 'GMAIL_USER and GMAIL_APP_PASSWORD not set in Vercel'
        : !user
          ? 'GMAIL_USER not set in Vercel'
          : 'GMAIL_APP_PASSWORD not set in Vercel',
    }
  }

  const mailer = getMailer()
  const transporter = mailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  })

  // Verify credentials first (clearer errors)
  await transporter.verify()

  await transporter.sendMail({
    from: `"Dino Dominion Support" <${user}>`,
    to,
    replyTo,
    subject,
    text,
  })
  return { ok: true, via: 'gmail' }
}

async function sendViaResend({ to, replyTo, subject, text }) {
  const key = process.env.RESEND_API_KEY
  if (!key) return { ok: false, skip: true, error: 'RESEND_API_KEY not set' }

  const upstream = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Dino Dominion Support <onboarding@resend.dev>',
      to: [to],
      reply_to: replyTo,
      subject,
      text,
    }),
  })
  const data = await upstream.json().catch(() => ({}))
  if (!upstream.ok) {
    return {
      ok: false,
      error: data?.message || `Resend error ${upstream.status}`,
    }
  }
  return { ok: true, via: 'resend' }
}

export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      return res.end()
    }

    // Safe status (no secrets) — helps confirm env vars after redeploy
    if (req.method === 'GET') {
      return sendJson(res, 200, {
        ok: true,
        env: envStatus(),
        hint: envStatus().gmailReady
          ? 'Gmail env looks set. POST a form to send a test mail.'
          : 'Set GMAIL_USER + GMAIL_APP_PASSWORD in Vercel → Settings → Environment Variables (Production), then Redeploy.',
      })
    }

    if (req.method !== 'POST') {
      return sendJson(res, 405, { error: 'Method not allowed' })
    }

    const body = parseBody(req)
    if (body === null) {
      return sendJson(res, 400, { error: 'Invalid JSON body' })
    }

    if (clean(body.website, 200)) {
      return sendJson(res, 200, { ok: true, via: 'honeypot' })
    }

    const name = clean(body.name, 80)
    const email = clean(body.email, 120).toLowerCase()
    const accountId = clean(body.accountId, 80)
    const message = clean(body.message, 4000)
    const lastQuestion = clean(body.lastQuestion, 1000)
    const chatSummary = clean(body.chatSummary, 3000)

    if (!email || !isEmail(email)) {
      return sendJson(res, 400, { error: 'A valid email is required so we can reply.' })
    }
    if (!message || message.length < 5) {
      return sendJson(res, 400, { error: 'Please describe your issue (at least a few words).' })
    }

    const to =
      clean(process.env.SUPPORT_TO_EMAIL, 120) ||
      clean(process.env.GMAIL_USER, 120) ||
      DEFAULT_TO
    const subject = `[Support] ` + (clean(body.subject, 120) || 'Dino Dominion website')
    const text = buildText({
      name,
      email,
      accountId,
      message,
      lastQuestion,
      chatSummary,
    })

    const env = envStatus()
    const tried = []

    // 1) Gmail — if env is set, this is the only path (clear errors, no silent fallback)
    if (env.gmailUser || env.gmailPass) {
      try {
        const gmail = await sendViaGmail({ to, replyTo: email, subject, text })
        if (gmail.ok) {
          return sendJson(res, 200, { ok: true, via: 'gmail' })
        }
        if (!gmail.skip) {
          tried.push(`gmail: ${gmail.error || 'failed'}`)
        } else {
          tried.push(`gmail: ${gmail.error}`)
        }
        // Credentials partially/fully set but send failed → return clear error
        return sendJson(res, 502, {
          ok: false,
          code: 'GMAIL_FAILED',
          error:
            gmail.error ||
            'Gmail send failed. Check App Password, 2-Step Verification, and that env vars are on Production + Redeploy done.',
          env,
          tried,
        })
      } catch (err) {
        const msg = err?.message || String(err)
        console.error('[api/support-email] gmail', msg)
        // Common Google messages
        let hint = msg
        if (/Invalid login|Username and Password not accepted|EAUTH/i.test(msg)) {
          hint =
            'Gmail rejected login. Use a Google App Password (not your normal password). Enable 2-Step Verification first. Copy the 16-character code into GMAIL_APP_PASSWORD, then Redeploy.'
        } else if (/self-signed|certificate/i.test(msg)) {
          hint = 'TLS/certificate error talking to Gmail SMTP.'
        }
        return sendJson(res, 502, {
          ok: false,
          code: 'GMAIL_FAILED',
          error: hint,
          env,
          tried: [...tried, `gmail: ${msg}`],
        })
      }
    }

    // 2) Resend (only if Gmail not configured)
    try {
      const resend = await sendViaResend({ to, replyTo: email, subject, text })
      if (resend.ok) return sendJson(res, 200, { ok: true, via: 'resend' })
      if (!resend.skip) {
        return sendJson(res, 502, {
          ok: false,
          code: 'RESEND_FAILED',
          error: resend.error,
          env,
        })
      }
      tried.push('resend: not configured')
    } catch (err) {
      return sendJson(res, 502, {
        ok: false,
        code: 'RESEND_FAILED',
        error: err?.message || 'Resend failed',
        env,
      })
    }

    // Nothing configured
    return sendJson(res, 503, {
      ok: false,
      code: 'NO_MAIL_PROVIDER',
      error:
        'No mail provider configured. In Vercel → Settings → Environment Variables set GMAIL_USER and GMAIL_APP_PASSWORD (Production), then Redeploy.',
      env,
      tried,
    })
  } catch (err) {
    console.error('[api/support-email] crash', err)
    return sendJson(res, 500, {
      error: err?.message || 'Server error',
      code: 'SERVER_ERROR',
    })
  }
}
