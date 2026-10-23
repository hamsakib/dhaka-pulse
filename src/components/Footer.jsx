import Link from "next/link";
import { Logo } from "./Navbar";

const SOCIAL = {
  Facebook: "M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.7-.6Z",
  Instagram: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
  LinkedIn: "M4 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-2 6h4v11H2V10Zm7 0h3.8v1.6c.6-1 1.9-1.9 3.8-1.9 4 0 4.4 2.6 4.4 6V21h-4v-5.3c0-1.4 0-3.1-1.9-3.1s-2.1 1.5-2.1 3V21H9V10Z",
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-x grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-fg">
            A simple guide to what&apos;s on in Dhaka: concerts, meetups, food walks, workshops and festivals, all in one place.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/items" className="text-muted-fg hover:text-primary">All events</Link></li>
            <li><Link href="/items?category=Music" className="text-muted-fg hover:text-primary">Concerts</Link></li>
            <li><Link href="/items?price=free" className="text-muted-fg hover:text-primary">Free events</Link></li>
            <li><Link href="/about" className="text-muted-fg hover:text-primary">About</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Organisers</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/items/add" className="text-muted-fg hover:text-primary">Add an event</Link></li>
            <li><Link href="/items/manage" className="text-muted-fg hover:text-primary">Manage events</Link></li>
            <li><Link href="/register" className="text-muted-fg hover:text-primary">Create an account</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-sm text-muted-fg sm:flex-row">
          <p>© {new Date().getFullYear()} Dhaka Pulse. Built with Next.js and Firebase.</p>
          <ul className="flex gap-2">
            {Object.entries(SOCIAL).map(([name, d]) => (
              <li key={name}>
                <a href={`https://www.${name.toLowerCase()}.com/`} target="_blank" rel="noopener noreferrer" aria-label={`Dhaka Pulse on ${name}`} className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-muted hover:text-primary">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path d={d} /></svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
