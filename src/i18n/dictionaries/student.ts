import type { Locale } from "../config";

export const student = {
  ar: {
    welcome: "أهلًا بك، {name} 👋",
    dashboardSubtitle: "إليك ملخص رحلتك التعليمية اليوم.",
    myCertificatesLink: "شهاداتي",
    pointsLabel: "النقاط",
    streakLabel: "المتتالية",
    streakSuffix: " يوم",
    completedSessionsLabel: "حصص مكتملة",
    badgesLabel: "الشارات",
    nextSessionLabel: "حصتك القادمة",
    withTeacher: "مع",
    sessionFocusPrefix: "محور الحصة:",
    noUpcomingTitle: "لا توجد حصص قادمة بعد",
    noUpcomingSubtitle: "احجز حصتك الأولى الآن وابدأ رحلتك!",
    enterSession: "ادخل الحصة",
    bookNow: "احجز حصة الآن",
    progressTitle: "تقدمي في الحفظ والمراجعة",
    progressEmpty: "سيظهر تقدمك هنا بعد أول حصة مع معلمك.",
    badgesTitle: "شاراتي",
    badgesEmpty: "أكمل حصتك الأولى لتحصل على أول شارة 🌱",
    historyTitle: "سجل الحصص السابقة",
    historyEmpty: "لا توجد حصص سابقة بعد.",
    teacherNotePrefix: "ملاحظة المعلم:",

    bookPageTitle: "احجز حصتك القادمة",
    bookPageSubtitle: "اختر المعلم المناسب لك والقراءة التي تريد تعلمها.",
    noTeachersYet: "لا يوجد معلمون مسجلون بعد.",

    filterByQiraat: "تصفية حسب القراءة:",
    allOption: "الكل",
    noTeachersForQiraat: "لا يوجد معلمون لهذه القراءة حاليًا.",

    reviewsSuffix: "تقييم",
    yearsExperienceSuffix: "سنوات خبرة",
    close: "إغلاق",
    viewSlotsAndBook: "عرض المواعيد والحجز",
    noSlotsAvailable: "لا توجد مواعيد متاحة حاليًا لهذا المعلم.",
    chooseDay: "اختر يومًا",
    chooseTime: "اختر وقتًا",
    chooseDateFirst: "اختر يومًا من التقويم لعرض الأوقات المتاحة.",
    focusQuestion: "ما الذي تريد التركيز عليه؟ (اختياري)",
    focusPlaceholder: "مثال: سورة البقرة، مراجعة التجويد...",
    bookingFailedDefault: "تعذر الحجز",
    bookingInProgress: "جارٍ الحجز...",
    confirmBooking: "تأكيد الحجز",

    prevMonth: "الشهر السابق",
    nextMonth: "الشهر القادم",
  },
  en: {
    welcome: "Welcome, {name} 👋",
    dashboardSubtitle: "Here's a summary of your learning journey today.",
    myCertificatesLink: "My Certificates",
    pointsLabel: "Points",
    streakLabel: "Streak",
    streakSuffix: " day",
    completedSessionsLabel: "Completed Sessions",
    badgesLabel: "Badges",
    nextSessionLabel: "Your next session",
    withTeacher: "with",
    sessionFocusPrefix: "Session focus:",
    noUpcomingTitle: "No upcoming sessions yet",
    noUpcomingSubtitle: "Book your first session now and start your journey!",
    enterSession: "Join Session",
    bookNow: "Book a Session Now",
    progressTitle: "My Memorization & Review Progress",
    progressEmpty: "Your progress will appear here after your first session with your teacher.",
    badgesTitle: "My Badges",
    badgesEmpty: "Complete your first session to earn your first badge 🌱",
    historyTitle: "Past Sessions History",
    historyEmpty: "No past sessions yet.",
    teacherNotePrefix: "Teacher's note:",

    bookPageTitle: "Book Your Next Session",
    bookPageSubtitle: "Choose the right teacher and the qira'a you want to learn.",
    noTeachersYet: "No teachers registered yet.",

    filterByQiraat: "Filter by qira'a:",
    allOption: "All",
    noTeachersForQiraat: "No teachers available for this qira'a currently.",

    reviewsSuffix: "reviews",
    yearsExperienceSuffix: "years of experience",
    close: "Close",
    viewSlotsAndBook: "View Times & Book",
    noSlotsAvailable: "No slots currently available for this teacher.",
    chooseDay: "Choose a day",
    chooseTime: "Choose a time",
    chooseDateFirst: "Choose a day from the calendar to see available times.",
    focusQuestion: "What would you like to focus on? (optional)",
    focusPlaceholder: "e.g. Surah Al-Baqarah, Tajweed review...",
    bookingFailedDefault: "Booking failed",
    bookingInProgress: "Booking...",
    confirmBooking: "Confirm Booking",

    prevMonth: "Previous month",
    nextMonth: "Next month",
  },
} as const;

export function progressStatusLabel(status: string, locale: Locale): string {
  if (locale === "en") {
    if (status === "مكتمل") return "Completed";
    if (status === "مراجعة") return "In Review";
    return "In Progress";
  }
  return status;
}
