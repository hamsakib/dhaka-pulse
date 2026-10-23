import { BookOpen, Briefcase, CalendarCheck, Mic2, Music, Palette, Search, ShieldCheck, Smile, Trophy, Utensils, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { CATEGORIES, EVENTS } from "@/data/events";

const ICONS = { Music, Tech: Briefcase, Food: Utensils, Art: Palette, Sports: Trophy, Workshop: Wrench, Comedy: Mic2, Books: BookOpen };

const FEATURES = [
  { icon: Search, title: "Find it fast", text: "Search by name and filter by category, area and price to see only what you'd actually go to." },
  { icon: CalendarCheck, title: "All the details", text: "Date, time, venue, price, capacity and organiser on every event, so there are no surprises." },
  { icon: ShieldCheck, title: "Organiser tools", text: "Log in to publish your own event in under a minute and manage everything you've listed." },
];

const TESTIMONIALS = [
  { quote: "I found the Old Dhaka food walk here and went with my cousins. We'd lived in the city for years and still discovered lanes we'd never seen.", name: "Nabila R.", role: "Attended a food walk" },
  { quote: "Posting our meetup took two minutes, and the page had everything people asked us about before: venue, time, whether it's free.", name: "Tahmid A.", role: "Community organiser" },
  { quote: "The free filter is my favourite. Most weekends I just check what's free near Dhanmondi and pick something.", name: "Sumaiya K.", role: "Weekend explorer" },
];

export default function HomePage() {
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c, EVENTS.filter((e) => e.category === c).length]));
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1800&q=75" alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b1120]/95 via-[#0b1120]/75 to-[#0b1120]/30" />
        <div className="container-x flex min-h-[60vh] flex-col justify-center py-20 text-white">
          <p className="text-xs font-semibold tracking-widest text-orange-300 uppercase">What&apos;s on in Dhaka</p>
          <h1 className="h-display mt-4 max-w-3xl animate-rise">Find something worth leaving the house for.</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
            Concerts, meetups, food walks, workshops and festivals across the city, in one simple list you can search and filter.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/items" className="btn bg-white px-6 py-3 text-base text-[#1e1b4b] hover:bg-white/90">Browse events</Link>
            <Link href="/items/add" className="btn border border-white/40 px-6 py-3 text-base text-white hover:bg-white/10">List your event</Link>
          </div>
        </div>
      </section>

      {/* 1. Categories */}
      <section className="py-16 sm:py-20" aria-labelledby="cat-title">
        <div className="container-x">
          <p className="kicker">Browse</p>
          <h2 id="cat-title" className="h1 mt-2">Pick a vibe</h2>
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CATEGORIES.map((c) => {
              const Icon = ICONS[c];
              return (
                <li key={c}>
                  <Link href={`/items?category=${c}`} className="card group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:border-primary focus-visible:border-primary">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-fg transition group-hover:bg-primary group-hover:text-primary-fg">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-semibold">{c}</span>
                      <span className="text-xs text-muted-fg">{counts[c]} event{counts[c] === 1 ? "" : "s"}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 2. Upcoming events */}
      <section className="bg-muted/60 py-16 sm:py-20" aria-labelledby="upcoming-title">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">Coming up</p>
              <h2 id="upcoming-title" className="h1 mt-2">The next few weeks</h2>
            </div>
            <Link href="/items" className="rounded-xl text-sm font-semibold text-primary hover:underline">See all events →</Link>
          </div>
          <UpcomingEvents />
        </div>
      </section>

      {/* 3. Features */}
      <section className="py-16 sm:py-20" aria-labelledby="why-title">
        <div className="container-x">
          <p className="kicker">Why Dhaka Pulse</p>
          <h2 id="why-title" className="h1 mt-2 max-w-xl">Less scrolling through posts, more going out</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card p-6 transition hover:shadow-lg">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-soft-fg"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <h3 className="h3 mt-5">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-fg">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Testimonials */}
      <section className="bg-primary py-16 text-primary-fg sm:py-20" aria-labelledby="say-title">
        <div className="container-x">
          <h2 id="say-title" className="h1 text-center">People are getting out more</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="flex h-full flex-col rounded-xl border border-white/15 bg-white/10 p-6 transition hover:bg-white/15 dark:border-black/10 dark:bg-black/10">
                <Smile className="h-6 w-6 opacity-80" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed opacity-90">“{t.quote}”</blockquote>
                <figcaption className="mt-5 border-t border-current/20 pt-4">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs opacity-80">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
