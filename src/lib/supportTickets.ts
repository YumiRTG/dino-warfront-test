/**
 * Persist support tickets in Firestore so nothing is lost if email fails.
 * Collection: supportTickets
 */
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { ensureAnonymousAuth } from '@/lib/firebaseAccounts'
import { getFirebase } from '@/lib/firebase'

export const SUPPORT_TICKETS_COLLECTION = 'supportTickets'

export type SupportTicketInput = {
  name: string
  email: string
  accountId: string
  message: string
  lastQuestion: string
  chatSummary: string
}

export async function saveSupportTicket(
  input: SupportTicketInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    await ensureAnonymousAuth()
    const { db } = getFirebase()
    const ref = await addDoc(collection(db, SUPPORT_TICKETS_COLLECTION), {
      name: input.name.slice(0, 80),
      email: input.email.slice(0, 120).toLowerCase(),
      accountId: input.accountId.slice(0, 80),
      message: input.message.slice(0, 4000),
      lastQuestion: input.lastQuestion.slice(0, 1000),
      chatSummary: input.chatSummary.slice(0, 3000),
      source: 'website-support-chat',
      status: 'open',
      createdAt: serverTimestamp(),
    })
    return { ok: true, id: ref.id }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Could not save ticket'
    return { ok: false, error: msg }
  }
}
