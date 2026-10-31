// Badge rows store a `label` written in whatever language was active when the
// badge was earned (see src/lib/gamification.ts). Display should always
// derive the label fresh from the stable `type` key instead, so a badge
// earned in Arabic still shows correctly for a viewer in English.
export const badgeLabels = {
  ar: {
    first_session: "أول خطوة",
    five_sessions: "ملتزم",
    ten_sessions: "متفوق",
    streak_5: "مواظب",
    points_100: "بطل الفجر",
  },
  en: {
    first_session: "First Step",
    five_sessions: "Committed",
    ten_sessions: "High Achiever",
    streak_5: "Consistent",
    points_100: "Al-Fajr Champion",
  },
} as const;

export function badgeLabel(type: string, locale: "ar" | "en"): string {
  const dict = badgeLabels[locale] as Record<string, string>;
  return dict[type] ?? badgeLabels.ar[type as keyof typeof badgeLabels.ar] ?? type;
}
