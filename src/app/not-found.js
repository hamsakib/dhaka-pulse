import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="font-display text-7xl font-bold text-primary">404</p>
      <h1 className="h1">This page took the night off</h1>
      <p className="lead">The link may be old. Try the events list instead.</p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary">Go home</Link>
        <Link href="/items" className="btn-outline">Browse events</Link>
      </div>
    </div>
  );
}
