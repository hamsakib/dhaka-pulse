"use client";

import { Eye, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { useEvents } from "@/hooks/useEvents";
import { deleteEvent, restoreSeedEvents } from "@/lib/events-store";
import { formatDate, formatPrice } from "@/lib/format";

function ConfirmDialog({ event, onCancel, onConfirm }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    if (event && !ref.current.open) ref.current.showModal();
    if (!event && ref.current.open) ref.current.close();
  }, [event]);
  return (
    <dialog ref={ref} onClose={onCancel} aria-labelledby={titleId} className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-border bg-surface p-6 text-fg shadow-2xl backdrop:bg-black/50">
      <h2 id={titleId} className="h3">Delete this event?</h2>
      <p className="mt-2 text-sm text-muted-fg">“{event?.title}” will be removed from the list.</p>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" className="btn-outline" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </dialog>
  );
}

export function ManageEvents() {
  const events = useEvents();
  const [query, setQuery] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const list = events.filter((e) => `${e.title} ${e.category} ${e.area}`.toLowerCase().includes(query.trim().toLowerCase()));

  const confirmDelete = () => {
    deleteEvent(toDelete.id);
    toast.success("Event deleted", { description: toDelete.title });
    setToDelete(null);
  };

  return (
    <div className="container-x py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Organisers</p>
          <h1 className="h1 mt-2">Manage events</h1>
          <p className="lead mt-2">{events.length} events listed. Events you add are saved in this browser.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-ghost" onClick={() => { restoreSeedEvents(); toast.success("Sample events restored"); }}>
            <RotateCcw className="h-4 w-4" /> Restore samples
          </button>
          <Link href="/items/add" className="btn-primary"><Plus className="h-4 w-4" /> Add event</Link>
        </div>
      </div>

      <div className="relative mt-8 max-w-md">
        <label htmlFor="manage-search" className="sr-only">Search your events</label>
        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-fg" aria-hidden="true" />
        <input id="manage-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by title, category or area" className="field pl-10" />
      </div>

      {/* Table on tablet/desktop */}
      <div className="card mt-6 hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">All events</caption>
          <thead className="bg-muted text-xs text-muted-fg uppercase">
            <tr>
              <th scope="col" className="px-4 py-3">Event</th>
              <th scope="col" className="px-4 py-3">Category</th>
              <th scope="col" className="px-4 py-3">Date</th>
              <th scope="col" className="px-4 py-3">Area</th>
              <th scope="col" className="px-4 py-3">Price</th>
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((e) => (
              <tr key={e.id} className="hover:bg-muted/50">
                <td className="px-4 py-3">
                  <p className="font-semibold">{e.title}</p>
                  <p className="text-xs text-muted-fg">{e.userAdded ? "Added by you" : e.organizer}</p>
                </td>
                <td className="px-4 py-3">{e.category}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatDate(e.date, { day: "numeric", month: "short", year: "numeric" })}</td>
                <td className="px-4 py-3">{e.area}</td>
                <td className="px-4 py-3 font-medium">{formatPrice(e.price)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/items/${e.id}`} className="btn-outline px-3 py-1.5" aria-label={`View ${e.title}`}><Eye className="h-4 w-4" /> View</Link>
                    <button type="button" onClick={() => setToDelete(e)} className="btn px-3 py-1.5 text-danger hover:bg-danger-soft" aria-label={`Delete ${e.title}`}><Trash2 className="h-4 w-4" /> Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards on mobile */}
      <ul className="mt-6 grid grid-cols-1 gap-4 md:hidden">
        {list.map((e) => (
          <li key={e.id} className="card p-4">
            <p className="font-semibold">{e.title}</p>
            <p className="mt-1 text-xs text-muted-fg">{e.category} · {formatDate(e.date)} · {e.area} · {formatPrice(e.price)}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href={`/items/${e.id}`} className="btn-outline py-2"><Eye className="h-4 w-4" /> View</Link>
              <button type="button" onClick={() => setToDelete(e)} className="btn py-2 text-danger hover:bg-danger-soft"><Trash2 className="h-4 w-4" /> Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {list.length === 0 && <p className="card mt-6 p-10 text-center text-muted-fg">No events found.</p>}
      <ConfirmDialog event={toDelete} onCancel={() => setToDelete(null)} onConfirm={confirmDelete} />
    </div>
  );
}
