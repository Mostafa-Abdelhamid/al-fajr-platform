export type EffectiveStatus = "COMPLETED" | "SCHEDULED" | "MISSED" | "CANCELLED";

// A session can sit at status "SCHEDULED" forever if nobody ever marks it
// complete (or it simply never happened). Compute the status actually worth
// showing instead of trusting the stored value once its time has passed.
export function getEffectiveStatus(session: { status: string; startAt: Date }): EffectiveStatus {
  if (session.status === "SCHEDULED" && session.startAt.getTime() < Date.now()) {
    return "MISSED";
  }
  return session.status as EffectiveStatus;
}

export const STATUS_LABELS: Record<EffectiveStatus, string> = {
  COMPLETED: "مكتملة",
  SCHEDULED: "قادمة",
  MISSED: "فائتة",
  CANCELLED: "ملغاة",
};

export const STATUS_BADGE_CLASSES: Record<EffectiveStatus, string> = {
  COMPLETED: "bg-green-100 text-green-700",
  SCHEDULED: "bg-blue-100 text-blue-700",
  MISSED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-600",
};
