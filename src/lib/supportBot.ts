/**
 * Free on-site support assistant — no API keys, no credits, no server costs.
 * Keyword knowledge base for Dino Warfront website + game basics.
 */

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
  at: number
}

type KbEntry = {
  keys: string[]
  answerEn: string
  answerDe: string
}

const KB: KbEntry[] = [
  {
    keys: ['download', 'apk', 'install', 'android', 'herunterladen', 'installation', 'laden'],
    answerEn:
      'Open the Download page on your phone → tap Download APK → allow install from the browser if asked. The file is large (~2.6 GB), use Wi‑Fi. Then launch Dino Warfront.',
    answerDe:
      'Öffne die Download-Seite auf dem Handy → Download APK tippen → Installation aus dem Browser erlauben, falls gefragt. Die Datei ist groß (~2,6 GB), am besten per WLAN. Danach Dino Warfront starten.',
  },
  {
    keys: ['login', 'account', 'account id', 'anmelden', 'accountid', 'player id', 'settings', 'einstellungen'],
    answerEn:
      'Tap Log in and enter your Account player ID from the game (Settings). No password. Your commander name loads automatically. You cannot create an account on the website.',
    answerDe:
      'Tippe auf Log in und gib deine Account-Player-ID aus dem Spiel ein (Einstellungen). Kein Passwort. Der Commander-Name wird automatisch geladen. Auf der Website kann man keinen Account erstellen.',
  },
  {
    keys: ['daily', 'login reward', 'streak', 'täglich', 'belohnung', 'tages'],
    answerEn:
      'Go to Play → Daily login. Claim once per day (resets 00:00 UTC). Keep your streak for better speed ups. Open the game afterwards so rewards sync to your inventory.',
    answerDe:
      'Gehe zu Play → Daily login. Einmal pro Tag abholen (Reset 00:00 UTC). Streak halten für bessere Speed-ups. Danach das Spiel öffnen, damit die Belohnungen ins Inventar kommen.',
  },
  {
    keys: ['roulette', 'spin', 'wheel', 'glücksrad', 'rad'],
    answerEn:
      'On Play → Roulette you get 1 free spin every 24 hours. Wins are speed ups sent to your game account — open the app to collect them.',
    answerDe:
      'Unter Play → Roulette hast du 1 kostenlosen Spin alle 24 Stunden. Gewinne sind Speed-ups für deinen Account — Spiel öffnen zum Einsammeln.',
  },
  {
    keys: ['reward', 'speed up', 'speedup', 'inventory', 'inventar', 'item', 'beschleun'],
    answerEn:
      'Website rewards (daily + roulette) are tied to your Account ID and added in-game when the app is online. Claim on the site, then open the game.',
    answerDe:
      'Website-Belohnungen (Daily + Roulette) hängen an deiner Account-ID und landen im Spiel, wenn die App online ist. Auf der Seite abholen, dann Spiel öffnen.',
  },
  {
    keys: ['discord', 'community', 'chat server'],
    answerEn:
      'Discord is “coming soon” in the footer. For now use this Support chat — I’m free and always available on the site.',
    answerDe:
      'Discord steht im Footer noch auf „coming soon“. Bis dahin hilft dieser Support-Chat — kostenlos und immer auf der Seite verfügbar.',
  },
  {
    keys: ['forum', 'board'],
    answerEn:
      'Forum is coming soon. Until then ask here about install, login, rewards or game basics.',
    answerDe:
      'Das Forum kommt bald. Bis dahin frag hier zu Installation, Login, Belohnungen oder Spiel-Basics.',
  },
  {
    keys: ['support', 'help', 'hilfe', 'problem', 'bug', 'error', 'fehler'],
    answerEn:
      'I’m your Dominion Support assistant. I help with APK install, Account ID login, daily rewards, roulette and game basics. What’s wrong?',
    answerDe:
      'Ich bin dein Dominion Support-Assistent. Ich helfe bei APK, Account-ID-Login, Daily, Roulette und Spiel-Basics. Was ist das Problem?',
  },
  {
    keys: ['dino', 'dinosaur', 'tyranno', 'raptor', 'creature', 'bestiary', 'saurier'],
    answerEn:
      'Open Bestiary for dinosaurs and heroes. In-game you tame creatures and use their skills in campaign battles.',
    answerDe:
      'Unter Bestiary siehst du Dinos und Helden. Im Spiel zähmst du Kreaturen und nutzt ihre Skills in der Campaign.',
  },
  {
    keys: ['hero', 'nyra', 'commander', 'ally', 'held'],
    answerEn:
      'Nyra Vale is the main commander. Other heroes are in Bestiary. Recruit and level them in-game for skills and battle power.',
    answerDe:
      'Nyra Vale ist die Haupt-Commanderin. Weitere Helden stehen unter Bestiary. Im Spiel rekrutieren und leveln für Skills und Kampfkraft.',
  },
  {
    keys: ['feature', 'gameplay', 'build', 'base', 'campaign', 'how to play', 'spielen', 'basis'],
    answerEn:
      'Core loop: build base → train troops → recruit heroes → tame dinos → clear campaign → grow offline. See Features and Story for more.',
    answerDe:
      'Ablauf: Basis bauen → Truppen trainieren → Helden rekrutieren → Dinos zähmen → Campaign spielen → offline wachsen. Mehr unter Features und Story.',
  },
  {
    keys: ['permission', 'firebase', 'cloud', 'login failed', 'fehlgeschlagen'],
    answerEn:
      'If login fails: check Account ID (from game Settings), internet, and try again. The ID must match a real player in the game cloud.',
    answerDe:
      'Wenn Login scheitert: Account-ID prüfen (Spiel → Einstellungen), Internet checken, nochmal versuchen. Die ID muss zu einem echten Spieler in der Cloud passen.',
  },
  {
    keys: ['link', 'website', 'url', 'freunde', 'share', 'teilen'],
    answerEn:
      'Share this site with friends: https://app-dino-dominion.vercel.app/ — Download, Play rewards and Support are all there.',
    answerDe:
      'Teile die Seite mit Freunden: https://app-dino-dominion.vercel.app/ — Download, Play-Belohnungen und Support sind dort.',
  },
  {
    keys: ['credit', 'kosten', 'kostenlos', 'pay', 'money', 'gratis', 'free', 'ki', 'ai', 'grok'],
    answerEn:
      'This Support chat is completely free — no credits, no subscription. It runs on the site itself.',
    answerDe:
      'Dieser Support-Chat ist komplett kostenlos — keine Credits, kein Abo. Er läuft direkt auf der Website.',
  },
  {
    keys: ['hello', 'hi', 'hey', 'hallo', 'moin', 'servus', 'hiya'],
    answerEn:
      'Hey commander! I’m Dominion Support (free). Ask about download, login, daily rewards, roulette or dinos.',
    answerDe:
      'Hey Commander! Ich bin Dominion Support (kostenlos). Frag zu Download, Login, Daily, Roulette oder Dinos.',
  },
  {
    keys: ['thank', 'danke', 'thx', 'thanks'],
    answerEn: 'Anytime. Good hunting — Tame. Hunt. Conquer.',
    answerDe: 'Gerne. Viel Erfolg — Tame. Hunt. Conquer.',
  },
]

function isGerman(q: string): boolean {
  return /[äöüß]|(\b(und|ich|wie|was|wo|kann|nicht|bitte|hilfe|herunterladen|anmelden|einstellungen|belohnung|täglich|spiel|seite)\b)/i.test(
    q
  )
}

function score(entry: KbEntry, q: string): number {
  let s = 0
  for (const k of entry.keys) {
    if (q.includes(k)) s += k.length > 4 ? 3 : 2
  }
  return s
}

export type SupportAnswer = {
  text: string
  /** false = no KB match — offer email form to human support */
  matched: boolean
}

export function supportAnswer(userText: string): SupportAnswer {
  const raw = userText.trim()
  const q = raw.toLowerCase()
  if (!q) {
    return {
      matched: true,
      text: isGerman(raw)
        ? 'Schreib kurz deine Frage — z. B. „Wie lade ich die APK?“ oder „Wo ist meine Account ID?“'
        : 'Type a short question — e.g. “How do I download?” or “Where is my Account ID?”',
    }
  }

  let best: KbEntry | null = null
  let bestScore = 0
  for (const entry of KB) {
    const s = score(entry, q)
    if (s > bestScore) {
      bestScore = s
      best = entry
    }
  }

  const de = isGerman(q)
  if (best && bestScore > 0) {
    return { matched: true, text: de ? best.answerDe : best.answerEn }
  }

  return {
    matched: false,
    text: de
      ? 'Dazu habe ich keine passende Antwort. Nutze das Formular unten — deine Nachricht geht per E-Mail an den Support, und wir melden uns bei dir.'
      : 'I don’t have a fixed answer for that. Use the form below — your message is emailed to support and we’ll get back to you.',
  }
}

/** @deprecated prefer supportAnswer */
export function supportReply(userText: string): string {
  return supportAnswer(userText).text
}

export function welcomeMessage(): string {
  return (
    'Hey! I’m your Dominion Support assistant. ' +
    'Ask about download, Account ID login, daily rewards, roulette, dinos — DE or EN is fine. ' +
    'If I can’t help, you can email human support from this chat.'
  )
}
