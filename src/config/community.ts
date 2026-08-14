/**
 * Community / support links — set real URLs when ready.
 * Leave empty string to show “coming soon”.
 *
 * Support email is delivered via /api/support-email (server-side).
 * Set SUPPORT_TO_EMAIL in Vercel env to override the default inbox.
 */
export const COMMUNITY = {
  discordUrl: '', // e.g. 'https://discord.gg/your-invite'
  forumUrl: '', // e.g. 'https://forum.example.com'
  /** Public contact label only — real delivery uses server SUPPORT_TO_EMAIL */
  supportEmail: 'andre.miethke74@gmail.com',
} as const
