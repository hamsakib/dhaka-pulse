"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { AREAS, CATEGORIES } from "@/data/events";
import { addEvent } from "@/lib/events-store";

const EMPTY = { title: "", shortDescription: "", description: "", category: "", date: "", time: "", price: "", venue: "", area: "", capacity: "", image: "" };
const today = () => new Date().toISOString().slice(0, 10);

function validate(v) {
  const e = {};
  if (v.title.trim().length < 5) e.title = "Title must be at least 5 characters";
  if (v.shortDescription.trim().length < 15) e.shortDescription = "Short description must be at least 15 characters";
  else if (v.shortDescription.length > 140) e.shortDescription = "Keep it under 140 characters";
  if (v.description.trim().length < 40) e.description = "Full description must be at least 40 characters";
  if (!v.category) e.category = "Choose a category";
  if (!v.date) e.date = "Choose a date";
  else if (v.date < today()) e.date = "Date can't be in the past";
  if (v.price === "" || Number(v.price) < 0 || !Number.isFinite(Number(v.price))) e.price = "Enter a price (0 for free)";
  if (v.venue.trim().length < 3) e.venue = "Enter the venue";
  if (!v.area) e.area = "Choose an area";
  if (v.capacity && (!Number.isInteger(Number(v.capacity)) || Number(v.capacity) < 1)) e.capacity = "Capacity must be a whole number";
  if (v.image && !/^https?:\/\/\S+\.\S+/.test(v.image)) e.image = "Enter a valid image URL starting with http(s)://";
  return e;
}

function Control({ id, label, required, error, hint, as = "input", children, ...props }) {
  const Tag = as;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <Tag
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={`field ${as === "textarea" ? "h-auto py-3" : ""} ${error ? "border-danger" : ""}`}
        {...props}
      >
        {children}
      </Tag>
      {error ? <p id={`${id}-err`} role="alert" className="mt-1 text-xs font-medium text-danger">{error}</p> : hint ? <p id={`${id}-hint`} className="mt-1 text-xs text-muted-fg">{hint}</p> : null}
    </div>
  );
}

export function AddEventForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [v, setV] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => {
    setV((s) => ({ ...s, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const found = validate(v);
    setErrors(found);
    if (Object.keys(found).length) {
      toast.error("Please fix the highlighted fields");
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    setSaving(true);
    const event = addEvent({
      ...v,
      title: v.title.trim(),
      shortDescription: v.shortDescription.trim(),
      description: v.description.trim(),
      price: Number(v.price),
      capacity: v.capacity ? Number(v.capacity) : null,
      organizer: user.name,
      ownerUid: user.uid,
      tags: [v.category, Number(v.price) === 0 ? "Free" : "Ticketed"],
    });
    toast.success("Event published", { description: event.title, action: { label: "View", onClick: () => router.push(`/items/${event.id}`) } });
    setV(EMPTY);
    setSaving(false);
  };

  return (
    <form onSubmit={submit} noValidate className="card mt-8 grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 sm:p-8">
      <div className="sm:col-span-2">
        <Control id="title" label="Title" required value={v.title} onChange={set("title")} error={errors.title} placeholder="e.g. Sunday Jazz at the Lake" />
      </div>
      <div className="sm:col-span-2">
        <Control id="shortDescription" label="Short description" required value={v.shortDescription} onChange={set("shortDescription")} error={errors.shortDescription} hint={`${v.shortDescription.length}/140 characters. Shown on event cards.`} />
      </div>
      <div className="sm:col-span-2">
        <Control id="description" label="Full description" required as="textarea" rows={6} value={v.description} onChange={set("description")} error={errors.description} hint="What happens, who it's for and anything people should bring." />
      </div>
      <Control id="category" label="Category" required as="select" value={v.category} onChange={set("category")} error={errors.category}>
        <option value="">Choose a category</option>
        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
      </Control>
      <Control id="price" label="Price (৳)" required type="number" min="0" inputMode="numeric" value={v.price} onChange={set("price")} error={errors.price} hint="Use 0 for a free event." />
      <Control id="date" label="Date" required type="date" min={today()} value={v.date} onChange={set("date")} error={errors.date} />
      <Control id="time" label="Start time" type="time" value={v.time} onChange={set("time")} error={errors.time} />
      <Control id="venue" label="Venue" required value={v.venue} onChange={set("venue")} error={errors.venue} placeholder="Venue name and road" />
      <Control id="area" label="Area" required as="select" value={v.area} onChange={set("area")} error={errors.area}>
        <option value="">Choose an area</option>
        {AREAS.map((a) => <option key={a}>{a}</option>)}
      </Control>
      <Control id="capacity" label="Capacity" type="number" min="1" inputMode="numeric" value={v.capacity} onChange={set("capacity")} error={errors.capacity} hint="Optional" />
      <Control id="image" label="Image URL" type="url" value={v.image} onChange={set("image")} error={errors.image} hint="Optional. Leave empty for a colour cover." placeholder="https://…" />
      <div className="flex flex-wrap gap-3 sm:col-span-2">
        <button type="submit" disabled={saving} className="btn-primary px-6 py-3">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Submit event
        </button>
        <button type="button" onClick={() => router.push("/items/manage")} className="btn-ghost">Go to Manage Events</button>
      </div>
    </form>
  );
}
