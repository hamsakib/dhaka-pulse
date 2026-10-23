import { Suspense } from "react";
import { EventsBrowser } from "@/components/EventsBrowser";

export const metadata = {
  title: "All events",
  description: "Search and filter upcoming events in Dhaka by category, area and price.",
};

export default function ItemsPage() {
  return (
    <>
      <div className="border-b border-border bg-gradient-to-b from-primary-soft/60 to-transparent">
        <div className="container-x py-12">
          <p className="kicker">Events</p>
          <h1 className="h1 mt-2">Everything happening in Dhaka</h1>
          <p className="lead mt-3 max-w-2xl">Search by name, then filter by category, area and price.</p>
        </div>
      </div>
      <Suspense fallback={<div className="container-x py-10"><div className="h-96 animate-pulse rounded-xl bg-muted" /></div>}>
        <EventsBrowser />
      </Suspense>
    </>
  );
}
