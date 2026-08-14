import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

/**
 * Public web config for Firebase project dinodominion-289b0
 * (same project as the Unity game / google-services.json).
 *
 * Account login uses Account ID only (no password).
 * Auth: anonymous sign-in so Firestore rules that require request.auth work.
 */
const firebaseConfig = {
  apiKey: 'AIzaSyA67N3HcTbJT1f-I3gGelYuwhSxSa85M38',
  authDomain: 'dinodominion-289b0.firebaseapp.com',
  projectId: 'dinodominion-289b0',
  storageBucket: 'dinodominion-289b0.firebasestorage.app',
  messagingSenderId: '143942581338',
  // Android app id from google-services.json (works for web SDK in same project)
  appId: '1:143942581338:android:cdf4c0bb076c21550e2c63',
}

let app: FirebaseApp
let auth: Auth
let db: Firestore

export function getFirebase() {
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  }
  return { app, auth, db }
}

/** Firestore collection for web Account ID login (passwordless). */
export const ACCOUNTS_COLLECTION = 'accounts'
