"use client";

import { CalendarX, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AREAS, CATEGORIES } from "@/data/events";
import { useEvents } from "@/hooks/useEvents";
import { EventCard } from "./EventCard";

const PRICES = [
  { value: "", label: "Any price" },
  { value: "free", label: "Free" },
  { value: "under-1000", label: "Under ৳1,000" },
  { value: "1000-plus", label: "৳1,000 and up" },
];

function matchesPrice(price, filter) {
  const p = Number(price);
  if (filter === "free") return p === 0;
  if (filter === "under-1000") return p < 1000;
  if (filter === "1000-plus") return p >= 1000;
  return true;
}

export function EventsBrowser() {
  const params = useSearchParams();
  const events = useEvents();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(params.get("category") || "");
  const [area, setArea] = useState("");
  const [price, setPrice] = useState(params.get("price") || "");
  const [sort, setSort] = useState("date");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events
      .filter((e) => !q || `${e.title} ${e.shortDescription} ${e.venue} ${e.organizer}`.toLowerCase().includes(q))
      .filter((e) => !category || e.category === category)
      .filter((e) => !area || e.area === area)
      .filter((e) => matchesPrice(e.price, price))
      .sort((a, b) => (sort === "price" ? Number(a.price) - Number(b.price) : sort === "price-desc" ? Number(b.price) - Number(a.price) : a.date.localeCompare(b.date)));
  }, [events, query, category, area, price, sort]);

  const reset = () => {
    setQuery("");
    setCategory("");
    setArea("");
    setPrice("");
  };
  const filtered = query || category || area || price;

  return (
    <div className="container-x py-10">
      <div className="card grid grid-cols-1 gap-3 p-4 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
        <div className="relative">
          <label htmlFor="search" className="sr-only">Search events</label>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-fg" aria-hidden="true" />
          <input id="search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events, venues, organisers" className="field pl-10" />
        </div>
        <label className="sr-only" htmlFor="f-category">Category</label>
        <select id="f-category" value={category} onChange={(e) => setCategory(e.target.value)} className="field">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <label className="sr-only" htmlFor="f-area">Area</label>
        <select id="f-area" value={area} onChange={(e) => setArea(e.target.value)} className="field">
          <option value="">All areas</option>
          {AREAS.map((a) => <option key={a}>{a}</option>)}
        </select>
        <label className="sr-only" htmlFor="f-price">Price</label>
        <select id="f-price" value={price} onChange={(e) => setPrice(e.target.value)} className="field">
          {PRICES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <label className="sr-only" htmlFor="f-sort">Sort</label>
        <select id="f-sort" value={sort} onChange={(e) => setSort(e.target.value)} className="field">
          <option value="date">Soonest first</option>
          <option value="price">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-fg" aria-live="polite">{results.length} event{results.length === 1 ? "" : "s"}</p>
        {filtered && <button type="button" onClick={reset} className="text-sm font-semibold text-primary hover:underline">Clear filters</button>}
      </div>

      {results.length ? (
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((e, i) => <EventCard key={e.id} event={e} priority={i < 4} />)}
        </div>
      ) : (
        <div className="card mt-4 flex flex-col items-center gap-3 px-6 py-16 text-center">
          <CalendarX className="h-10 w-10 text-muted-fg" aria-hidden="true" />
          <p className="font-semibold">No events match those filters</p>
          <button type="button" onClick={reset} className="btn-outline">Clear filters</button>
        </div>
      )}
    </div>
  );
}
