type Availability = { dayOfWeek: number; startTime: string; endTime: string };

const SLOT_MINUTES = 60;
const DAYS_AHEAD = 10;
const MIN_LEAD_HOURS = 3;

// The whole platform runs on a single fixed timezone (Asia/Riyadh, UTC+3,
// no DST) rather than per-user timezones, so availability windows like
// "16:00" always mean 16:00 Gulf time regardless of the server's own
// local timezone (Render runs containers in UTC).
const GULF_OFFSET_MS = 3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export function generateAvailableSlots(
  availability: Availability[],
  bookedTimes: Date[],
  now: Date = new Date()
): Date[] {
  const booked = new Set(bookedTimes.map((d) => d.getTime()));
  const earliestAllowed = now.getTime() + MIN_LEAD_HOURS * 60 * 60 * 1000;
  const slots: Date[] = [];

  // Shift into a timeline whose UTC-getter fields read as Gulf wall-clock
  // time, so day-of-week and midnight boundaries are computed correctly
  // no matter what timezone this process happens to run in.
  const gulfNowMs = now.getTime() + GULF_OFFSET_MS;
  const gulfNow = new Date(gulfNowMs);
  const gulfMidnightMs =
    Date.UTC(gulfNow.getUTCFullYear(), gulfNow.getUTCMonth(), gulfNow.getUTCDate());

  for (let dayOffset = 0; dayOffset < DAYS_AHEAD; dayOffset++) {
    const dow = (gulfNow.getUTCDay() + dayOffset) % 7;
    const dayStartMs = gulfMidnightMs + dayOffset * DAY_MS;

    const windows = availability.filter((a) => a.dayOfWeek === dow);
    for (const w of windows) {
      const [startH, startM] = w.startTime.split(":").map(Number);
      const [endH, endM] = w.endTime.split(":").map(Number);

      const endMs = dayStartMs + (endH * 60 + endM) * 60 * 1000;
      let cursorMs = dayStartMs + (startH * 60 + startM) * 60 * 1000;

      while (cursorMs + SLOT_MINUTES * 60 * 1000 <= endMs) {
        const slotMs = cursorMs - GULF_OFFSET_MS;
        if (slotMs >= earliestAllowed && !booked.has(slotMs)) {
          slots.push(new Date(slotMs));
        }
        cursorMs += SLOT_MINUTES * 60 * 1000;
      }
    }
  }

  return slots.sort((a, b) => a.getTime() - b.getTime()).slice(0, 24);
}
