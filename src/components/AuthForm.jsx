"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { authErrorMessage } from "@/lib/firebase";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(mode, v) {
  const e = {};
  if (mode === "register" && v.name.trim().length < 2) e.name = "Enter your name (at least 2 characters)";
  if (!EMAIL.test(v.email.trim())) e.email = "Enter a valid email address";
  if (mode === "register") {
    if (v.password.length < 8) e.password = "Use at least 8 characters";
    else if (!/[A-Za-z]/.test(v.password) || !/\d/.test(v.password)) e.password = "Include at least one letter and one number";
    if (v.confirm !== v.password) e.confirm = "Passwords don't match";
  } else if (!v.password) {
    e.password = "Enter your password";
  }
  return e;
}

function Field({ id, label, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <input id={id} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} className={`field ${error ? "border-danger" : ""}`} {...props} />
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12s4.4 9.8 9.8 9.8c5.7 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6H12Z" />
    </svg>
  );
}

/** Shared login / register form. Redirects to `/` (or ?next) on success. */
export function AuthForm({ mode }) {
  const { login, register, loginWithGoogle, user, configured } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next")?.startsWith("/") && !params.get("next").startsWith("//") ? params.get("next") : "/";
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState("");

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(mode, values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy("email");
    try {
      if (mode === "register") await register(values.name.trim(), values.email.trim(), values.password);
      else await login(values.email.trim(), values.password);
      toast.success(mode === "register" ? "Account created. Welcome!" : "Welcome back!");
      router.replace(next);
    } catch (err) {
      const message = authErrorMessage(err);
      if (["auth/invalid-credential", "auth/wrong-password"].includes(err.code)) setErrors({ password: message });
      else if (["auth/email-already-in-use", "auth/invalid-email", "auth/user-not-found"].includes(err.code)) setErrors({ email: message });
      else toast.error(message);
    } finally {
      setBusy("");
    }
  };

  const google = async () => {
    setBusy("google");
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google");
      router.replace(next);
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="card p-6 sm:p-8">
      {!configured && (
        <p role="status" className="mb-6 flex gap-2 rounded-xl bg-accent-soft p-3 text-sm text-accent-soft-fg">
          <AlertTriangle className="h-5 w-5 shrink-0" /> Firebase isn&apos;t configured yet. Add the NEXT_PUBLIC_FIREBASE_* variables to .env.local (see README).
        </p>
      )}
      <button type="button" onClick={google} disabled={Boolean(busy) || !configured} className="btn-outline w-full py-3">
        {busy === "google" ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleIcon />} Continue with Google
      </button>
      <div className="my-6 flex items-center gap-3 text-xs text-muted-fg"><span className="h-px flex-1 bg-border" />or with email<span className="h-px flex-1 bg-border" /></div>
      <form onSubmit={submit} noValidate className="space-y-4">
        {mode === "register" && <Field id="name" label="Full name" autoComplete="name" value={values.name} onChange={set("name")} error={errors.name} />}
        <Field id="email" label="Email" type="email" autoComplete="email" value={values.email} onChange={set("email")} error={errors.email} />
        <Field id="password" label="Password" type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} value={values.password} onChange={set("password")} error={errors.password} />
        {mode === "register" && <Field id="confirm" label="Confirm password" type="password" autoComplete="new-password" value={values.confirm} onChange={set("confirm")} error={errors.confirm} />}
        <button type="submit" disabled={Boolean(busy) || !configured} className="btn-primary w-full py-3">
          {busy === "email" && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "register" ? "Create account" : "Log in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-fg">
        {mode === "register" ? (
          <>Already have an account? <Link href="/login" className="font-semibold text-primary hover:underline">Log in</Link></>
        ) : (
          <>New here? <Link href={`/register${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-primary hover:underline">Create an account</Link></>
        )}
      </p>
    </div>
  );
}
