"use client";

import { useEvents } from "@/hooks/useEvents";
import { EventCard } from "./EventCard";

export function UpcomingEvents() {
  const events = useEvents();
  const upcoming = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {upcoming.map((e, i) => <EventCard key={e.id} event={e} priority={i < 2} />)}
    </div>
  );
}
