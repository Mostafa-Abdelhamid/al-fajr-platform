type Availability = { dayOfWeek: number; startTime: string; endTime: string };

const SLOT_MINUTES = 60;
const DAYS_AHEAD = 10;
const MIN_LEAD_HOURS = 3;

export function generateAvailableSlots(
  availability: Availability[],
  bookedTimes: Date[],
  now: Date = new Date()
): Date[] {
  const booked = new Set(bookedTimes.map((d) => d.getTime()));
  const earliestAllowed = now.getTime() + MIN_LEAD_HOURS * 60 * 60 * 1000;
  const slots: Date[] = [];

  for (let dayOffset = 0; dayOffset < DAYS_AHEAD; dayOffset++) {
    const day = new Date(now);
    day.setDate(day.getDate() + dayOffset);
    const dow = day.getDay();

    const windows = availability.filter((a) => a.dayOfWeek === dow);
    for (const w of windows) {
      const [startH, startM] = w.startTime.split(":").map(Number);
      const [endH, endM] = w.endTime.split(":").map(Number);

      const cursor = new Date(day);
      cursor.setHours(startH, startM, 0, 0);
      const end = new Date(day);
      end.setHours(endH, endM, 0, 0);

      while (cursor.getTime() + SLOT_MINUTES * 60 * 1000 <= end.getTime()) {
        const slot = new Date(cursor);
        if (slot.getTime() >= earliestAllowed && !booked.has(slot.getTime())) {
          slots.push(new Date(slot));
        }
        cursor.setMinutes(cursor.getMinutes() + SLOT_MINUTES);
      }
    }
  }

  return slots.sort((a, b) => a.getTime() - b.getTime()).slice(0, 24);
}
