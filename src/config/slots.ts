import type { DeliverySlot } from "../types/order/checkout";

const SLOT_START_HOUR = 12;
const SLOT_END_HOUR = 24;
const LEAD_HOURS = 1;

// ─── Local time helpers (Egypt = UTC+3, no DST) ───────────────

const EGYPT_OFFSET_MS = 3 * 60 * 60 * 1000;

function toEgyptDate(utcDate: Date): Date {
  return new Date(utcDate.getTime() + EGYPT_OFFSET_MS);
}

function egyptNow(): Date {
  return toEgyptDate(new Date());
}

/**
 * Formats using local Egypt hours (no toISOString, no UTC leakage).
 * Returns "YYYY-MM-DDTHH:mm:ss" in Egypt local time.
 */
export function slotToISOString(slot: DeliverySlot): string {
  const d = toEgyptDate(slot.date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
  );
}

// ─── Slot builders ────────────────────────────────────────────

function buildSlotsForDay(day: Date, isToday: boolean): DeliverySlot[] {
  const slots: DeliverySlot[] = [];
  const now = new Date();
  const cutoff = new Date(now.getTime() + LEAD_HOURS * 60 * 60 * 1000);

  // day is already a UTC midnight for the target Egypt date
  for (let hour = SLOT_START_HOUR; hour < SLOT_END_HOUR; hour++) {
    const slotDate = new Date(day);
    slotDate.setUTCHours(hour - 3, 0, 0, 0); // Egypt hour → UTC

    const isAvailable = isToday ? slotDate > cutoff : true;

    const egyptDate = toEgyptDate(slotDate);
    const dayKey = isToday
      ? "today"
      : `${egyptDate.getUTCFullYear()}-${String(egyptDate.getUTCMonth() + 1).padStart(2, "0")}-${String(egyptDate.getUTCDate()).padStart(2, "0")}`;

    const paddedHour = String(hour).padStart(2, "0");
    const id = `${dayKey}-${paddedHour}:00`;
    const label = formatSlotLabel(hour);

    slots.push({ id, label, date: slotDate, isInstant: false, isAvailable });
  }

  return slots;
}

function formatSlotLabel(startHour: number): string {
  const endHour = startHour + 1;
  return `${formatHour(startHour)} – ${formatHour(endHour)}`;
}

function formatHour(hour: number): string {
  const normalized = hour % 24;
  const period = normalized === 0 || normalized < 12 ? "AM" : "PM";
  const h = normalized === 0 ? 12 : normalized > 12 ? normalized - 12 : normalized;
  return `${h}:00 ${period}`;
}

export function buildInstantSlot(): DeliverySlot {
  return {
    id: "instant",
    label: "Instant",
    date: new Date(), // sent via slotToISOString → Egypt local time
    isInstant: true,
    isAvailable: true,
  };
}

export function buildTodaySlots(): DeliverySlot[] {
  const today = new Date();
  // Anchor to UTC midnight of today's Egypt date
  const egyptToday = toEgyptDate(today);
  const anchor = new Date(Date.UTC(
    egyptToday.getUTCFullYear(),
    egyptToday.getUTCMonth(),
    egyptToday.getUTCDate(),
  ));
  return buildSlotsForDay(anchor, true).filter((s) => s.isAvailable);
}

export function buildUpcomingDays(): { dateKey: string; label: string; slots: DeliverySlot[] }[] {
  const days: { dateKey: string; label: string; slots: DeliverySlot[] }[] = [];
  const egyptToday = toEgyptDate(new Date());

  for (let i = 1; i <= 6; i++) {
    const anchor = new Date(Date.UTC(
      egyptToday.getUTCFullYear(),
      egyptToday.getUTCMonth(),
      egyptToday.getUTCDate() + i,
    ));

    const dateKey = `${anchor.getUTCFullYear()}-${String(anchor.getUTCMonth() + 1).padStart(2, "0")}-${String(anchor.getUTCDate()).padStart(2, "0")}`;
    const label = formatDayLabel(anchor);
    const slots = buildSlotsForDay(anchor, false);

    days.push({ dateKey, label, slots });
  }

  return days;
}

// ─── Day label ────────────────────────────────────────────────

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDayLabel(utcAnchor: Date): string {
  const dayName = DAY_NAMES[utcAnchor.getUTCDay()];
  const month = MONTH_NAMES[utcAnchor.getUTCMonth()];
  return `${dayName}, ${month} ${utcAnchor.getUTCDate()}`;
}