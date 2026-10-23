"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { firebaseConfigured, getFirebaseAuth, googleProvider } from "@/lib/firebase";

const AuthContext = createContext(null);

function toUser(u) {
  return u ? { uid: u.uid, name: u.displayName || u.email?.split("@")[0] || "Member", email: u.email, photo: u.photoURL } : null;
}

/** Firebase auth state shared through the Context API. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(firebaseConfigured);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(toUser(u));
      setLoading(false);
    });
  }, []);

  const requireAuth = () => {
    const auth = getFirebaseAuth();
    if (!auth) throw Object.assign(new Error("Firebase is not configured"), { code: "app/not-configured" });
    return auth;
  };

  const login = useCallback((email, password) => signInWithEmailAndPassword(requireAuth(), email, password), []);
  const loginWithGoogle = useCallback(() => signInWithPopup(requireAuth(), googleProvider), []);
  const register = useCallback(async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(requireAuth(), email, password);
    await updateProfile(cred.user, { displayName: name });
    setUser(toUser({ ...cred.user, displayName: name }));
    return cred;
  }, []);
  const logout = useCallback(() => signOut(requireAuth()), []);

  const value = useMemo(
    () => ({ user, loading, configured: firebaseConfigured, login, loginWithGoogle, register, logout }),
    [user, loading, login, loginWithGoogle, register, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
