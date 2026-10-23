import { getApp, getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, connectAuthEmulator, getAuth } from "firebase/auth";

// Firebase web config is public by design; access is protected by Firebase Auth rules
// and the authorised domains list in the Firebase console.
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);

let authInstance = null;

/** Lazily initialised so the app still renders (with a notice) when env vars are missing. */
export function getFirebaseAuth() {
  if (!firebaseConfigured) return null;
  if (!authInstance) {
    const app = getApps().length ? getApp() : initializeApp(config);
    authInstance = getAuth(app);
    // Local development against the Firebase Auth Emulator (see README → "Run without a Firebase project").
    const emulator = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;
    if (emulator && process.env.NODE_ENV !== "production") {
      connectAuthEmulator(authInstance, `http://${emulator}`, { disableWarnings: true });
    }
  }
  return authInstance;
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

/** Friendly messages for the Firebase Auth error codes users actually hit. */
export function authErrorMessage(error) {
  const map = {
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/user-not-found": "No account found with that email.",
    "auth/email-already-in-use": "An account with this email already exists. Try logging in.",
    "auth/weak-password": "Password is too weak. Use at least 8 characters.",
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/too-many-requests": "Too many attempts. Please wait a minute and try again.",
    "auth/popup-closed-by-user": "Google sign-in was closed before finishing.",
    "auth/cancelled-popup-request": "Google sign-in was cancelled.",
    "auth/popup-blocked": "Your browser blocked the Google pop-up. Allow pop-ups and try again.",
    "auth/network-request-failed": "Network error. Check your connection and try again.",
    "auth/unauthorized-domain": "This domain isn't authorised in Firebase yet. Add it under Authentication → Settings → Authorized domains.",
    "auth/operation-not-allowed": "This sign-in method isn't enabled in Firebase yet.",
  };
  return map[error?.code] || "Something went wrong. Please try again.";
}
