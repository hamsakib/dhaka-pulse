import { EventDetail } from "@/components/EventDetail";
import { EVENTS } from "@/data/events";

// Seed events are pre-rendered; events added in the browser render on demand.
export function generateStaticParams() {
  return EVENTS.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const event = EVENTS.find((e) => e.id === id);
  return event ? { title: event.title, description: event.shortDescription } : { title: "Event" };
}

export default async function EventPage({ params }) {
  const { id } = await params;
  return <EventDetail id={id} />;
}
