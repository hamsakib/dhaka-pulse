"use client";

import { ArrowLeft, Banknote, CalendarDays, Clock, MapPin, Tag, User, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEvents } from "@/hooks/useEvents";
import { formatDate, formatPrice, formatTime } from "@/lib/format";
import { EventCard } from "./EventCard";

export function EventDetail({ id }) {
  const events = useEvents();
  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="container-x flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="h1">Event not found</h1>
        <p className="lead">It may have been removed, or it was added in a different browser.</p>
        <Link href="/items" className="btn-primary">Back to events</Link>
      </div>
    );
  }

  const related = events.filter((e) => e.id !== event.id && e.category === event.category).slice(0, 4);
  const fallbackRelated = related.length ? related : events.filter((e) => e.id !== event.id).slice(0, 4);
  const info = [
    { icon: CalendarDays, label: "Date", value: formatDate(event.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
    { icon: Clock, label: "Time", value: formatTime(event.time) || "To be announced" },
    { icon: MapPin, label: "Venue", value: `${event.venue}, ${event.area}` },
    { icon: Banknote, label: "Price", value: formatPrice(event.price) },
    { icon: Tag, label: "Category", value: event.category },
    { icon: Users, label: "Capacity", value: event.capacity ? `${event.capacity} people` : "Open" },
    { icon: User, label: "Organiser", value: event.organizer || "Community listing" },
  ];

  return (
    <>
      <div className="container-x py-8">
        <Link href="/items" className="btn-ghost -ml-3 px-3">
          <ArrowLeft className="h-4 w-4" /> Back to events
        </Link>
        <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
              {event.image?.startsWith("https://images.unsplash.com/") ? (
                <Image src={event.image} alt={event.title} fill priority sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" />
              ) : event.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={event.image} alt={event.title} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary to-accent text-primary-fg"><CalendarDays className="h-16 w-16" /></div>
              )}
            </div>
            <p className="kicker mt-8">{event.category}</p>
            <h1 className="h1 mt-2">{event.title}</h1>
            <p className="lead mt-3">{event.shortDescription}</p>
            <section className="mt-8" aria-labelledby="about-event">
              <h2 id="about-event" className="h3">About this event</h2>
              <div className="mt-3 space-y-4 leading-relaxed text-muted-fg">
                {event.description.split(/\n\s*\n/).map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
              </div>
            </section>
            {event.tags?.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {event.tags.map((t) => <li key={t} className="rounded-xl bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-soft-fg">{t}</li>)}
              </ul>
            )}
          </div>
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="card p-6">
              <p className="text-3xl font-bold">{formatPrice(event.price)}</p>
              <p className="mt-1 text-sm text-muted-fg">{Number(event.price) === 0 ? "Free entry, registration recommended" : "Per person, pay at the venue or organiser"}</p>
              <h2 className="sr-only">Key information</h2>
              <dl className="mt-6 space-y-4">
                {info.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-medium text-muted-fg">{label}</dt>
                      <dd className="text-sm font-medium">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </div>
      <section className="border-t border-border bg-muted/60 py-14" aria-labelledby="related-title">
        <div className="container-x">
          <h2 id="related-title" className="h2">{related.length ? `More ${event.category.toLowerCase()} events` : "You might also like"}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {fallbackRelated.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </div>
      </section>
    </>
  );
}
