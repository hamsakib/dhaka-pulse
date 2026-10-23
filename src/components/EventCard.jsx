import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { dateParts, formatDate, formatPrice } from "@/lib/format";

function Cover({ event, priority }) {
  if (event.image?.startsWith("https://images.unsplash.com/")) {
    return <Image src={event.image} alt="" fill priority={priority} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />;
  }
  if (event.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={event.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />;
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary to-accent text-primary-fg" aria-hidden="true">
      <CalendarDays className="h-12 w-12 opacity-80" />
    </div>
  );
}

/** Uniform event card: fixed image ratio, clamped text, button pinned to the bottom. */
export function EventCard({ event, priority = false }) {
  const { day, month } = dateParts(event.date);
  return (
    <article className="group card flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Cover event={event} priority={priority} />
        <span className="absolute top-3 left-3 flex flex-col items-center rounded-xl bg-surface/95 px-3 py-1.5 text-center shadow-sm">
          <span className="text-lg leading-none font-bold">{day}</span>
          <span className="text-[11px] font-semibold text-accent uppercase">{month}</span>
        </span>
        <span className="absolute top-3 right-3 rounded-xl bg-primary px-2.5 py-1 text-xs font-semibold text-primary-fg">{event.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 h-12 text-base leading-6 font-semibold">{event.title}</h3>
        <p className="mt-2 line-clamp-2 h-10 text-sm leading-5 text-muted-fg">{event.shortDescription}</p>
        <div className="mt-4 space-y-1.5 text-xs text-muted-fg">
          <p className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {formatDate(event.date)}</p>
          <p className="flex items-center gap-2 truncate"><MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {event.area}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className={`text-base font-bold ${Number(event.price) === 0 ? "text-success" : ""}`}>{formatPrice(event.price)}</span>
          <Link href={`/items/${event.id}`} className="btn-primary px-4 py-2">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
