export const teacher = {
  ar: {
    greeting: "أهلًا بك، ",
    dashboardSubtitle: "إليك نظرة سريعة على جدولك وطلابك.",
    statUpcoming: "حصص قادمة",
    statCompleted: "حصص مكتملة",
    statStudentCount: "عدد الطلاب",
    statRating: "التقييم",
    statPoints: "نقاطي",
    downloadMySchedule: "📊 تنزيل جدولي (Excel)",
    upcomingSessionsTitle: "حصصك القادمة",
    manageAvailabilityLink: "إدارة أوقات التواجد",
    noUpcoming: "لا توجد حصص قادمة حاليًا.",
    enterSession: "🎥 ادخل الحصة",
    missedTitle: "حصص فائتة",
    missedDesc: "هذه الحصص انتهى وقتها دون أن يتم تسجيلها كمكتملة. ادخل كل حصة وأنهِها لتحديث سجل الطالب.",
    finishSession: "إنهاء الحصة",
    studentsTitle: "طلابي ومتابعة تقدمهم",
    noStudents: "سيظهر هنا طلابك بعد أول حصة محجوزة.",
    recentCompletedTitle: "آخر الحصص المكتملة",
    noCompleted: "لا توجد حصص مكتملة بعد.",

    availabilityPageTitle: "أوقات تواجدي",
    availabilityPageSubtitle: "حدّد الأوقات الأسبوعية التي يمكن للطلاب حجز حصص معك خلالها.",

    addNewSlotTitle: "إضافة وقت تواجد جديد",
    dayLabel: "اليوم",
    fromLabel: "من الساعة",
    toLabel: "إلى الساعة",
    adding: "جارٍ الإضافة...",
    add: "إضافة",
    addFailed: "تعذر الإضافة",
    currentSlotsTitle: "أوقاتي المتاحة حاليًا",
    noSlotsMessage: "لم تضف أي أوقات تواجد بعد. الطلاب لن يتمكنوا من حجز حصص معك حتى تضيف أوقاتًا.",
    rangeFrom: "— من",
    rangeTo: "إلى",
    delete: "حذف",

    saveFailed: "فشل الحفظ",
    saved: "تم ✓",
    updateProgress: "تحديث التقدم",
  },
  en: {
    greeting: "Welcome back, ",
    dashboardSubtitle: "Here's a quick look at your schedule and students.",
    statUpcoming: "Upcoming Sessions",
    statCompleted: "Completed Sessions",
    statStudentCount: "Students",
    statRating: "Rating",
    statPoints: "My Points",
    downloadMySchedule: "📊 Download My Schedule (Excel)",
    upcomingSessionsTitle: "Your Upcoming Sessions",
    manageAvailabilityLink: "Manage Availability",
    noUpcoming: "No upcoming sessions right now.",
    enterSession: "🎥 Join Session",
    missedTitle: "Missed Sessions",
    missedDesc: "These sessions' time has passed without being marked complete. Open each one and finish it to update the student's record.",
    finishSession: "Finish Session",
    studentsTitle: "My Students & Their Progress",
    noStudents: "Your students will appear here after the first booked session.",
    recentCompletedTitle: "Recently Completed Sessions",
    noCompleted: "No completed sessions yet.",

    availabilityPageTitle: "My Availability",
    availabilityPageSubtitle: "Set the weekly time windows students can book sessions with you in.",

    addNewSlotTitle: "Add a New Availability Window",
    dayLabel: "Day",
    fromLabel: "From",
    toLabel: "To",
    adding: "Adding...",
    add: "Add",
    addFailed: "Could not add",
    currentSlotsTitle: "My Current Availability",
    noSlotsMessage: "You haven't added any availability yet. Students won't be able to book sessions with you until you do.",
    rangeFrom: "— from",
    rangeTo: "to",
    delete: "Delete",

    saveFailed: "Save failed",
    saved: "Saved ✓",
    updateProgress: "Update Progress",
  },
} as const;

export const DAYS_AR = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
export const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const DAYS_SHORT_AR = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
export const DAYS_SHORT_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const progressStatusLabels: Record<"ar" | "en", Record<string, string>> = {
  ar: { "قيد الحفظ": "قيد الحفظ", "مراجعة": "مراجعة", "مكتمل": "مكتمل" },
  en: { "قيد الحفظ": "In Progress", "مراجعة": "Review", "مكتمل": "Completed" },
};
