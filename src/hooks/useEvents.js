"use client";

import { useSyncExternalStore } from "react";
import { EVENTS } from "@/data/events";
import { getAllEvents, subscribe } from "@/lib/events-store";

// useSyncExternalStore needs a stable snapshot, so cache by the raw storage strings.
let cacheKey = null;
let cacheValue = EVENTS;

function snapshot() {
  const key = `${localStorage.getItem("dp_events_added")}|${localStorage.getItem("dp_events_hidden")}`;
  if (key !== cacheKey) {
    cacheKey = key;
    cacheValue = getAllEvents();
  }
  return cacheValue;
}

/** All events (seed + this browser's additions), kept in sync with localStorage. */
export function useEvents() {
  return useSyncExternalStore(subscribe, snapshot, () => EVENTS);
}
