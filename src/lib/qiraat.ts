/**
 * The Ten Canonical Qira'at (القراءات العشر), each with its two riwayat
 * (transmission chains). Teachers pick the specific riwaya they teach;
 * students can filter by it when browsing teachers.
 */
export const QIRAAT_GROUPS: { reciter: string; riwayat: string[] }[] = [
  { reciter: "نافع المدني", riwayat: ["قالون عن نافع", "ورش عن نافع"] },
  { reciter: "ابن كثير المكي", riwayat: ["البزي عن ابن كثير", "قنبل عن ابن كثير"] },
  { reciter: "أبو عمرو البصري", riwayat: ["الدوري عن أبي عمرو", "السوسي عن أبي عمرو"] },
  { reciter: "ابن عامر الشامي", riwayat: ["هشام عن ابن عامر", "ابن ذكوان عن ابن عامر"] },
  { reciter: "عاصم الكوفي", riwayat: ["شعبة عن عاصم", "حفص عن عاصم"] },
  { reciter: "حمزة الكوفي", riwayat: ["خلف عن حمزة", "خلاد عن حمزة"] },
  { reciter: "الكسائي الكوفي", riwayat: ["أبو الحارث عن الكسائي", "الدوري عن الكسائي"] },
  { reciter: "أبو جعفر المدني", riwayat: ["ابن وردان عن أبي جعفر", "ابن جماز عن أبي جعفر"] },
  { reciter: "يعقوب الحضرمي", riwayat: ["رويس عن يعقوب", "روح عن يعقوب"] },
  { reciter: "خلف العاشر", riwayat: ["إسحاق عن خلف العاشر", "إدريس عن خلف العاشر"] },
];

export const ALL_RIWAYAT: string[] = QIRAAT_GROUPS.flatMap((g) => g.riwayat);
