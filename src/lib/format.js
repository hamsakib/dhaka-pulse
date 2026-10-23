const number = new Intl.NumberFormat("en-IN");

export const formatPrice = (price) => (Number(price) === 0 ? "Free" : `৳${number.format(price)}`);

export function formatDate(date, opts = { weekday: "short", day: "numeric", month: "short", year: "numeric" }) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", opts);
}

export function formatTime(time) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  return new Date(2000, 0, 1, h, m).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function dateParts(date) {
  const d = new Date(`${date}T00:00:00`);
  return { day: d.getDate(), month: d.toLocaleString("en-GB", { month: "short" }) };
}
