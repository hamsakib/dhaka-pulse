import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "About", description: "What Dhaka Pulse is and why it exists." };

export default function AboutPage() {
  return (
    <div className="container-x py-12 sm:py-16">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="kicker">About</p>
          <h1 className="h1 mt-2">One calm place for everything on in Dhaka</h1>
          <div className="lead mt-5 space-y-4">
            <p>
              Great events happen in this city every week, but finding them usually means scrolling through dozens of pages and group chats, and still missing the one you would have loved.
            </p>
            <p>
              Dhaka Pulse puts concerts, meetups, food walks, workshops and festivals into a single list with the details that matter: when, where, how much and who is running it. Organisers can sign in and publish an event in about a minute.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/items" className="btn-primary">Browse events</Link>
            <Link href="/register" className="btn-outline">Create an account</Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
          <Image src="https://images.unsplash.com/photo-1706640254398-3b04782e8c76?auto=format&fit=crop&w=1200&q=75" alt="Aerial view of Dhaka with a river running through the city" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          ["Built for attendees", "Search, filter by area and price, and see every detail before you decide."],
          ["Open to organisers", "Any signed-in user can add an event and manage the ones they've listed."],
          ["Simple by design", "No ads and no endless feed. Just the events and what you need to know."],
        ].map(([title, text]) => (
          <div key={title} className="card p-6">
            <h2 className="h3">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-fg">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
