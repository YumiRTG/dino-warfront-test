import crypto from 'node:crypto'

/**
 * Opaque profile tokens.
 *
 * The Account ID is the website's login credential: anyone who knows it can
 * open a session as that commander, because login is passwordless by design.
 * So it must never appear in a shareable URL or in any API response.
 *
 * Profile links carry an encrypted token instead. Only the server holds the
 * key, so a token cannot be turned back into an Account ID by anyone reading
 * the page. The browser never sees a raw uid at all.
 *
 * The IV is derived from the uid rather than random, so one commander always
 * gets the same token. That keeps profile links stable and shareable, and lets
 * the CDN cache them. Deriving the IV from the plaintext is safe here because
 * an identical IV can only ever mean an identical uid.
 */

const KEY = crypto.createHash('sha256')
  .update(process.env.PROFILE_TOKEN_SECRET || 'dino-dominion-profile-fallback-key')
  .digest()

export function encodeUid(uid) {
  if (!uid) return ''
  const iv = crypto.createHmac('sha256', KEY).update(String(uid)).digest().subarray(0, 12)
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv)
  const body = Buffer.concat([cipher.update(String(uid), 'utf8'), cipher.final()])
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64url')
}

export function decodeToken(token) {
  try {
    const raw = Buffer.from(String(token), 'base64url')
    if (raw.length < 29) return null
    const iv = raw.subarray(0, 12)
    const tag = raw.subarray(12, 28)
    const body = raw.subarray(28)
    const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv)
    decipher.setAuthTag(tag)
    return Buffer.concat([decipher.update(body), decipher.final()]).toString('utf8')
  } catch {
    return null
  }
}
