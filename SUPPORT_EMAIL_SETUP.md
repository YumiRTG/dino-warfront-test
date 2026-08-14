# Support email setup (so tickets reach your Gmail)

The chat form posts to `/api/support-email`. Without SMTP config it falls back to FormSubmit (needs a one-time activation that often lands in **Spam**).

## Recommended: Gmail App Password (reliable)

1. Google Account of **andre.miethke74@gmail.com**  
   → [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (required)
3. Search **App passwords** → create one for “Mail” / “Dino Dominion”
4. Copy the 16-character password
5. Vercel → Project **app-dino-dominion** → **Settings → Environment Variables** (Production):

| Name | Value |
|------|--------|
| `GMAIL_USER` | `andre.miethke74@gmail.com` |
| `GMAIL_APP_PASSWORD` | `xxxx xxxx xxxx xxxx` (spaces ok) |
| `SUPPORT_TO_EMAIL` | `andre.miethke74@gmail.com` |

6. **Redeploy** (Deployments → … → Redeploy)

After that, every support form submission emails you directly. Reply-To is the player’s address.

## Optional: Resend

Set `RESEND_API_KEY` from [resend.com](https://resend.com). Free tier works with `onboarding@resend.dev` to your own email.

## FormSubmit (no setup key, but activation)

If no Gmail/Resend env is set, FormSubmit is used. First time you get **Activate Form** from `formsubmit.co` (check Spam). Click once, then messages flow.

## Firestore backup

Tickets can also be stored in `supportTickets` (see `firestore.support.rules.snippet.md`).  
Firebase Console → Firestore → `supportTickets`.
