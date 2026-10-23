"use client";

import { ChevronDown, LayoutList, LogOut, Menu, Moon, PlusCircle, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { UserAvatar } from "./UserAvatar";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/items", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/items?category=Music", label: "Concerts" },
  { href: "/items?price=free", label: "Free events" },
];

const useMounted = () => useSyncExternalStore(() => () => {}, () => true, () => false);

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 rounded-xl" aria-label="Dhaka Pulse home">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-fg">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 12h4l3-7 4 14 3-7h6" />
        </svg>
      </span>
      <span className="font-display text-lg font-bold tracking-tight">Dhaka Pulse</span>
    </Link>
  );
}

function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const dark = mounted && resolvedTheme === "dark";
  return (
    <button type="button" onClick={() => setTheme(dark ? "light" : "dark")} className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-fg hover:bg-muted hover:text-fg" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
      {mounted && (dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
    </button>
  );
}

/** After login: dropdown with user info, Add Event and Manage Events. */
function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onLogout = async () => {
    setOpen(false);
    await logout();
    toast.success("Logged out");
    router.push("/");
  };

  const item = "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted focus:bg-muted outline-none";
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-muted" aria-label="Open account menu">
        <UserAvatar user={user} />
        <ChevronDown className={`h-4 w-4 text-muted-fg transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-64 animate-rise rounded-xl border border-border bg-surface p-2 shadow-lg">
          <div className="flex items-center gap-3 border-b border-border px-3 pt-2 pb-3">
            <UserAvatar user={user} size="h-10 w-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted-fg">{user.email}</p>
            </div>
          </div>
          <div className="pt-2">
            <Link role="menuitem" href="/items/add" className={item} onClick={() => setOpen(false)}>
              <PlusCircle className="h-4 w-4 text-muted-fg" /> Add Event
            </Link>
            <Link role="menuitem" href="/items/manage" className={item} onClick={() => setOpen(false)}>
              <LayoutList className="h-4 w-4 text-muted-fg" /> Manage Events
            </Link>
            <button role="menuitem" type="button" onClick={onLogout} className={`${item} text-danger`}>
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  // Remember which path the mobile menu was opened on so navigating closes it.
  const [menuPath, setMenuPath] = useState(null);
  const mobileOpen = menuPath === pathname;
  const active = (href) => (href === "/" ? pathname === "/" : pathname === href.split("?")[0] && !href.includes("?"));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/85 backdrop-blur-md">
      <nav className="container-x flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Logo />
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} aria-current={active(l.href) ? "page" : undefined} className={`rounded-xl px-3 py-2 text-sm font-medium transition hover:text-fg ${active(l.href) ? "text-primary" : "text-muted-fg"}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1">
          <ThemeButton />
          {loading ? (
            <span className="h-9 w-24 animate-pulse rounded-xl bg-muted" />
          ) : user ? (
            <UserMenu />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn-ghost">Log in</Link>
              <Link href="/register" className="btn-primary">Register</Link>
            </div>
          )}
          <button type="button" onClick={() => setMenuPath(mobileOpen ? null : pathname)} className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-muted lg:hidden" aria-expanded={mobileOpen} aria-controls="mobile-nav" aria-label={mobileOpen ? "Close menu" : "Open menu"}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div id="mobile-nav" className="border-t border-border bg-surface lg:hidden">
          <ul className="container-x flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={`block rounded-xl px-4 py-3 font-medium ${active(l.href) ? "bg-primary-soft text-primary-soft-fg" : "hover:bg-muted"}`}>{l.label}</Link>
              </li>
            ))}
            <li className="mt-3 border-t border-border pt-4">
              {user ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/items/add" className="btn-outline">Add Event</Link>
                  <Link href="/items/manage" className="btn-outline">Manage</Link>
                  <button type="button" onClick={() => logout()} className="btn-ghost col-span-2 text-danger">Log out</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" className="btn-outline">Log in</Link>
                  <Link href="/register" className="btn-primary">Register</Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
