import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { COMMUNITY } from '@/config/community'
import { useAuth } from '@/hooks/useAuth'
import { asset } from '@/lib/assets'
import { supportAnswer, welcomeMessage, type ChatMessage } from '@/lib/supportBot'
import { saveSupportTicket } from '@/lib/supportTickets'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

type EmailStatus = 'idle' | 'sending' | 'ok' | 'error'

export default function SupportChat() {
  const { session } = useAuth()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: uid(), role: 'assistant', text: welcomeMessage(), at: Date.now() },
  ])
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [lastQuestion, setLastQuestion] = useState('')
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formAccountId, setFormAccountId] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle')
  const [emailError, setEmailError] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (session?.accountId && !formAccountId) {
      setFormAccountId(session.accountId)
    }
    if (session?.displayName && !formName) {
      setFormName(session.displayName)
    }
  }, [session, formAccountId, formName])

  useEffect(() => {
    if (!open) return
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    if (!showEmailForm) inputRef.current?.focus()
  }, [open, messages, typing, showEmailForm])

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === '#support') setOpen(true)
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    const onOpen = () => setOpen(true)
    window.addEventListener('dd-open-support', onOpen)
    return () => {
      window.removeEventListener('hashchange', openFromHash)
      window.removeEventListener('dd-open-support', onOpen)
    }
  }, [])

  const openEmailForm = (question?: string) => {
    const q = (question ?? lastQuestion).trim()
    setShowEmailForm(true)
    setEmailStatus('idle')
    setEmailError('')
    if (q && !formMessage) {
      setFormMessage(q)
    }
  }

  const send = (text?: string) => {
    const value = (text ?? input).trim()
    if (!value || typing) return

    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      text: value,
      at: Date.now(),
    }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLastQuestion(value)
    setTyping(true)
    setShowEmailForm(false)
    setEmailStatus('idle')

    window.setTimeout(() => {
      const answer = supportAnswer(value)
      setMessages((m) => [
        ...m,
        { id: uid(), role: 'assistant', text: answer.text, at: Date.now() },
      ])
      setTyping(false)
      if (!answer.matched) {
        setFormMessage((prev) => prev || value)
        setShowEmailForm(true)
      }
    }, 350 + Math.min(500, value.length * 8))
  }

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (emailStatus === 'sending') return

    const email = formEmail.trim()
    const message = formMessage.trim()
    if (!email || !message) {
      setEmailError('Email and message are required.')
      setEmailStatus('error')
      return
    }

    setEmailStatus('sending')
    setEmailError('')

    const chatSummary = messages
      .slice(-8)
      .map((m) => `${m.role === 'user' ? 'Player' : 'Bot'}: ${m.text}`)
      .join('\n')

    const payload = {
      name: formName.trim(),
      email,
      accountId: formAccountId.trim(),
      message,
      lastQuestion,
      chatSummary,
      subject: 'Website support chat',
      website: honeypot,
    }

    // Always try to save in Firestore (backup if mail fails)
    const ticket = await saveSupportTicket(payload)
    const savedNote = ticket.ok
      ? ' Ticket also saved in our system.'
      : ''

    try {
      const res = await fetch('/api/support-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        ok?: boolean
        needsActivation?: boolean
        code?: string
        via?: string
      }

      if (data.needsActivation || data.code === 'NEEDS_ACTIVATION') {
        setEmailStatus('error')
        setEmailError(
          data.error ||
            'Support inbox must activate FormSubmit once. Check Gmail + Spam for “formsubmit.co / Activate Form”, click the link, then send again.'
        )
        // Still useful: ticket may be in Firestore
        if (ticket.ok) {
          setMessages((m) => [
            ...m,
            {
              id: uid(),
              role: 'assistant',
              text:
                'Your ticket was saved in our system, but email delivery needs a one-time setup on the support inbox (FormSubmit activation). We’ll still see it in Firebase if rules allow.',
              at: Date.now(),
            },
          ])
        }
        return
      }

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || `Send failed (${res.status})`)
      }

      setEmailStatus('ok')
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: 'assistant',
          text:
            'Thanks! Your message was emailed to support. We’ll reply to your address as soon as we can.' +
            savedNote,
          at: Date.now(),
        },
      ])
      setShowEmailForm(false)
      setFormMessage('')
    } catch (err) {
      // Fallback: open the player's mail app pre-filled to support
      const supportTo = COMMUNITY.supportEmail || 'andre.miethke74@gmail.com'
      const mailto = `mailto:${encodeURIComponent(supportTo)}?subject=${encodeURIComponent(
        '[Support] Dino Warfront'
      )}&body=${encodeURIComponent(
        `Name: ${formName.trim() || '-'}\nEmail: ${email}\nAccount ID: ${formAccountId.trim() || '-'}\n\n${message}\n\n---\nLast question: ${lastQuestion || '-'}`
      )}`

      if (ticket.ok) {
        setEmailStatus('ok')
        setMessages((m) => [
          ...m,
          {
            id: uid(),
            role: 'assistant',
            text:
              'Email service is not fully set up yet, but your ticket was saved. You can also email us directly from your mail app — a compose window can open if you allow it.',
            at: Date.now(),
          },
        ])
        window.location.href = mailto
        setShowEmailForm(false)
        return
      }

      setEmailStatus('error')
      setEmailError(
        (err instanceof Error ? err.message : 'Could not send.') +
          ' You can still use “Open mail app” below.'
      )
      // Stash mailto for button
      ;(window as unknown as { __ddSupportMailto?: string }).__ddSupportMailto = mailto
    }
  }

  const quick = ['How do I download?', 'Account ID login', 'Daily rewards', 'Discord?']

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-[150] p-0 m-0 border-0 outline-none cursor-pointer bg-transparent shadow-none group"
        style={{ background: 'transparent', boxShadow: 'none' }}
        aria-label={open ? 'Close support chat' : 'Open support chat'}
      >
        <span className="relative block w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] bg-transparent transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
          <img
            src={asset('support-bot.png')}
            alt="Support"
            className="w-full h-full object-contain object-center bg-transparent pointer-events-none select-none"
            draggable={false}
          />
          {open && (
            <span className="absolute top-1 right-1 flex items-center justify-center w-7 h-7 rounded-full font-display text-lg text-white bg-black/50 leading-none">
              ×
            </span>
          )}
        </span>
      </button>

      {open && (
        <div
          className="fixed bottom-20 right-4 sm:right-5 z-[150] w-[min(100vw-1.5rem,380px)] h-[min(70vh,560px)] flex flex-col overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(165deg, rgba(26,66,48,0.97), rgba(12,26,18,0.98))',
            border: '1px solid rgba(240,193,77,0.28)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}
          role="dialog"
          aria-label="Support chat"
        >
          <div className="px-4 py-3 border-b border-white/10 flex items-start justify-between gap-2 shrink-0">
            <div>
              <p className="font-display text-lg text-white tracking-wide">SUPPORT</p>
              <p className="font-body text-[11px] text-[#d2c4a0]/75 mt-0.5">
                Helper · email when needed
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[#d2c4a0] hover:text-white bg-transparent border-none cursor-pointer text-xl leading-none px-1"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="px-3 py-2 border-b border-white/5 flex flex-wrap gap-2 shrink-0">
            <CommunityChip label="Discord" href={COMMUNITY.discordUrl} />
            <CommunityChip label="Forum" href={COMMUNITY.forumUrl} />
            <Link
              to="/download"
              onClick={() => setOpen(false)}
              className="font-ui text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full no-underline border border-[#f0c14d]/25 text-[#f0c14d] hover:bg-[#f0c14d]/10"
            >
              Download
            </Link>
            <button
              type="button"
              onClick={() => openEmailForm()}
              className="font-ui text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#f0c14d]/35 text-[#f0c14d] bg-transparent cursor-pointer hover:bg-[#f0c14d]/10"
            >
              Email us
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                  style={
                    m.role === 'user'
                      ? {
                          background: 'linear-gradient(135deg, #e85d04, #b84302)',
                          color: '#fff',
                          borderBottomRightRadius: 6,
                        }
                      : {
                          background: 'rgba(255,255,255,0.07)',
                          color: '#f3e8cf',
                          border: '1px solid rgba(240,193,77,0.12)',
                          borderBottomLeftRadius: 6,
                        }
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-2.5 text-xs text-[#d2c4a0] bg-white/5 border border-white/10">
                  Thinking…
                </div>
              </div>
            )}

            {showEmailForm && (
              <form
                onSubmit={(e) => void submitEmail(e)}
                className="rounded-2xl border border-[#f0c14d]/30 bg-black/30 p-3 space-y-2.5"
              >
                <p className="font-display text-sm text-[#f0c14d] tracking-wide">
                  EMAIL SUPPORT
                </p>
                <p className="font-body text-[11px] text-[#d2c4a0]/80 leading-relaxed">
                  We’ll receive this in our inbox and reply to your email.
                </p>

                {/* Honeypot — hidden from users */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute opacity-0 pointer-events-none h-0 w-0"
                  aria-hidden
                />

                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Your name (optional)"
                  maxLength={80}
                  className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-[#f3e8cf] outline-none focus:border-[#f0c14d]/50 placeholder:text-white/30"
                />
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="Your email *"
                  required
                  maxLength={120}
                  className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-[#f3e8cf] outline-none focus:border-[#f0c14d]/50 placeholder:text-white/30"
                />
                <input
                  type="text"
                  value={formAccountId}
                  onChange={(e) => setFormAccountId(e.target.value)}
                  placeholder="Account ID (optional)"
                  maxLength={80}
                  className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-[#f3e8cf] outline-none focus:border-[#f0c14d]/50 placeholder:text-white/30"
                />
                <textarea
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Describe your issue *"
                  required
                  rows={4}
                  maxLength={4000}
                  className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-[#f3e8cf] outline-none focus:border-[#f0c14d]/50 placeholder:text-white/30 resize-none"
                />

                {emailStatus === 'error' && emailError && (
                  <p className="font-body text-[11px] text-red-300 leading-relaxed">{emailError}</p>
                )}
                {emailStatus === 'ok' && (
                  <p className="font-body text-[11px] text-emerald-300">
                    Sent — we&apos;ll reply to your email.
                  </p>
                )}

                <div className="flex flex-wrap gap-2 pt-0.5">
                  <button
                    type="submit"
                    disabled={emailStatus === 'sending'}
                    className="btn-primary !px-4 !py-2 !text-[0.7rem] disabled:opacity-50 flex-1 min-w-[7rem]"
                  >
                    {emailStatus === 'sending' ? 'Sending…' : 'Send email'}
                  </button>
                  <a
                    href={`mailto:${COMMUNITY.supportEmail || 'andre.miethke74@gmail.com'}?subject=${encodeURIComponent(
                      '[Support] Dino Warfront'
                    )}&body=${encodeURIComponent(
                      `Name: ${formName.trim() || '-'}\nEmail: ${formEmail.trim() || '-'}\nAccount ID: ${formAccountId.trim() || '-'}\n\n${formMessage.trim() || ''}\n\n---\nLast question: ${lastQuestion || '-'}`
                    )}`}
                    className="font-ui text-[10px] uppercase tracking-wider px-3 py-2 rounded-lg border border-[#f0c14d]/30 text-[#f0c14d] no-underline hover:bg-[#f0c14d]/10 text-center"
                  >
                    Open mail app
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailForm(false)
                      setEmailStatus('idle')
                    }}
                    className="font-ui text-[10px] uppercase tracking-wider px-3 py-2 rounded-lg border border-white/15 text-[#d2c4a0] bg-transparent cursor-pointer hover:border-white/30"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {!showEmailForm && (
            <>
              <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {quick.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    disabled={typing}
                    className="font-body text-[11px] px-2.5 py-1 rounded-full border border-white/10 text-[#d2c4a0] bg-transparent cursor-pointer hover:border-[#f0c14d]/40 hover:text-[#f0c14d] disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <form
                className="p-3 border-t border-white/10 flex gap-2 shrink-0"
                onSubmit={(e) => {
                  e.preventDefault()
                  void send()
                }}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about download, login…"
                  disabled={typing}
                  className="flex-1 rounded-xl bg-black/25 border border-white/10 px-3 py-2.5 text-sm text-[#f3e8cf] outline-none focus:border-[#f0c14d]/50 placeholder:text-white/30"
                />
                <button
                  type="submit"
                  disabled={typing || !input.trim()}
                  className="btn-primary !px-4 !py-2.5 !text-[0.7rem] disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  )
}

function CommunityChip({ label, href }: { label: string; href: string }) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="font-ui text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full no-underline border border-[#f0c14d]/25 text-[#f0c14d] hover:bg-[#f0c14d]/10"
      >
        {label}
      </a>
    )
  }
  return (
    <span
      className="font-ui text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 text-white/35 cursor-default"
      title="Coming soon"
    >
      {label} · soon
    </span>
  )
}
