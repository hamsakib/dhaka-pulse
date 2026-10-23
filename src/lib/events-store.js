import { EVENTS } from "@/data/events";

/**
 * Event storage. Seed events ship with the app; events added through /items/add are saved
 * to localStorage in this browser. Deleting a seed event hides it (its id is remembered)
 * rather than editing the bundled data.
 */
const ADDED_KEY = "dp_events_added";
const HIDDEN_KEY = "dp_events_hidden";
const EVENT = "dp-events-changed";

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(EVENT));
}

export function getAllEvents() {
  const hidden = new Set(read(HIDDEN_KEY, []));
  return [...read(ADDED_KEY, []), ...EVENTS].filter((e) => !hidden.has(e.id));
}

export function getEvent(id) {
  return getAllEvents().find((e) => e.id === id) || null;
}

export function addEvent(event) {
  const id = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50)}-${Date.now().toString(36)}`;
  const record = { ...event, id, createdAt: new Date().toISOString(), userAdded: true };
  write(ADDED_KEY, [record, ...read(ADDED_KEY, [])]);
  return record;
}

export function deleteEvent(id) {
  const added = read(ADDED_KEY, []);
  if (added.some((e) => e.id === id)) {
    write(ADDED_KEY, added.filter((e) => e.id !== id));
  } else {
    write(HIDDEN_KEY, [...new Set([...read(HIDDEN_KEY, []), id])]);
  }
}

export function restoreSeedEvents() {
  write(HIDDEN_KEY, []);
}

/** Subscribe to changes from this tab and other tabs. */
export function subscribe(callback) {
  const onStorage = (e) => (e.key === ADDED_KEY || e.key === HIDDEN_KEY) && callback();
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}
