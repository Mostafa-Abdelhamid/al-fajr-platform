export const admin = {
  ar: {
    // admin/dashboard
    dashboardTitle: "لوحة إدارة منصة الفجر",
    dashboardSubtitle: "نظرة شاملة على نشاط المنصة والمستخدمين.",
    statStudents: "الطلاب",
    statTeachers: "المعلمون",
    statUpcoming: "حصص قادمة",
    statCompleted: "حصص مكتملة",
    statAvgRating: "متوسط التقييم",
    statTotalPoints: "إجمالي نقاط الطلاب",
    quickManageTeachersTitle: "إدارة المعلمين",
    quickManageTeachersDesc: "التوثيق والحذف",
    quickManageStudentsTitle: "إدارة الطلاب",
    quickManageStudentsDesc: "عرض وحذف الحسابات",
    quickManageQiraatTitle: "إدارة القراءات",
    quickManageQiraatDesc: "إضافة وحذف الروايات",
    recentSessionsTitle: "آخر الحصص على المنصة",
    noSessionsYet: "لا توجد حصص بعد.",
    sessionArrow: "←",

    // admin/teachers
    teachersPageTitle: "إدارة المعلمين والتوثيق",
    teachersPageSubtitle: "توثيق حسابات المعلمين أو حذفها عند الحاجة.",
    allTeachersTitle: "كل المعلمين",
    searchByNameEmail: "ابحث بالاسم أو البريد الإلكتروني...",
    noMatchingResults: "لا توجد نتائج مطابقة.",
    noTeachersYet: "لا يوجد معلمون مسجلون بعد.",
    ratingsLabel: "تقييم",
    availabilitySlotsLabel: "أوقات تواجد مُعرّفة",
    teacherPointsLabel: "نقطة",
    listSeparator: "، ",

    // admin/students
    studentsPageTitle: "إدارة الطلاب",
    studentsPageSubtitle: "عرض حسابات الطلاب وحذفها عند الحاجة.",
    allStudentsTitle: "كل الطلاب",
    noStudentsYet: "لا يوجد طلاب مسجلون بعد.",
    pointsLabel: "نقطة",
    streakLabel: "متتالية",

    // admin/qiraat
    qiraatPageTitle: "إدارة القراءات",
    qiraatPageSubtitle: "أضف أو احذف الروايات التي يمكن للمعلمين اختيارها عند التسجيل.",

    // VerifyToggle
    verifiedRevoke: "✅ موثّق — إلغاء التوثيق",
    unverifiedVerifyNow: "⏳ غير موثّق — توثيق الآن",

    // DeleteUserButton
    confirmDeleteUser:
      'هل أنت متأكد من حذف "{name}"؟ سيتم حذف كل بياناته (الحصص، التقدم، الشارات) نهائيًا ولا يمكن التراجع عن هذا الإجراء.',
    deleteUserFailed: "تعذر حذف المستخدم",
    deletingLabel: "جارٍ الحذف...",
    deleteLabel: "🗑️ حذف",

    // QiraatManager
    addNewRiwayaTitle: "إضافة رواية جديدة",
    reciterPlaceholder: "اسم القارئ (مثال: عاصم الكوفي)",
    riwayaPlaceholder: "اسم الرواية (مثال: حفص عن عاصم)",
    addingLabel: "جارٍ الإضافة...",
    addButtonLabel: "+ إضافة",
    addRiwayaFailed: "تعذرت إضافة الرواية",
    confirmDeleteRiwaya: 'هل تريد حذف رواية "{riwaya}" من قائمة القراءات؟',
    deleteRiwayaFailed: "تعذر حذف الرواية",
    currentQiraatTitle: "القراءات الحالية",
    noQiraatYet: "لا توجد قراءات بعد.",
    deleteTitle: "حذف",

    // QiraatMultiSelect
    loadQiraatFailed: "تعذّر تحميل قائمة القراءات. الرجاء إعادة تحميل الصفحة.",
    loadingQiraat: "جارٍ تحميل القراءات...",

    // AdminPagination
    showing: "عرض",
    of: "من",
    previous: "السابق",
    next: "التالي",
  },
  en: {
    dashboardTitle: "Al-Fajr Platform Admin Dashboard",
    dashboardSubtitle: "A complete overview of platform activity and users.",
    statStudents: "Students",
    statTeachers: "Teachers",
    statUpcoming: "Upcoming Sessions",
    statCompleted: "Completed Sessions",
    statAvgRating: "Average Rating",
    statTotalPoints: "Total Student Points",
    quickManageTeachersTitle: "Manage Teachers",
    quickManageTeachersDesc: "Verification & removal",
    quickManageStudentsTitle: "Manage Students",
    quickManageStudentsDesc: "View & remove accounts",
    quickManageQiraatTitle: "Manage Qira'at",
    quickManageQiraatDesc: "Add & remove riwayat",
    recentSessionsTitle: "Recent Sessions on the Platform",
    noSessionsYet: "No sessions yet.",
    sessionArrow: "→",

    teachersPageTitle: "Manage Teachers & Verification",
    teachersPageSubtitle: "Verify teacher accounts or remove them when needed.",
    allTeachersTitle: "All Teachers",
    searchByNameEmail: "Search by name or email...",
    noMatchingResults: "No matching results.",
    noTeachersYet: "No teachers registered yet.",
    ratingsLabel: "ratings",
    availabilitySlotsLabel: "availability slots set",
    teacherPointsLabel: "points",
    listSeparator: ", ",

    studentsPageTitle: "Manage Students",
    studentsPageSubtitle: "View student accounts and remove them when needed.",
    allStudentsTitle: "All Students",
    noStudentsYet: "No students registered yet.",
    pointsLabel: "points",
    streakLabel: "streak",

    qiraatPageTitle: "Manage Qira'at",
    qiraatPageSubtitle: "Add or remove the riwayat teachers can choose from when registering.",

    verifiedRevoke: "✅ Verified — Revoke",
    unverifiedVerifyNow: "⏳ Unverified — Verify now",

    confirmDeleteUser:
      'Are you sure you want to delete "{name}"? All their data (sessions, progress, badges) will be permanently deleted and this cannot be undone.',
    deleteUserFailed: "Failed to delete the user",
    deletingLabel: "Deleting...",
    deleteLabel: "🗑️ Delete",

    addNewRiwayaTitle: "Add a New Riwaya",
    reciterPlaceholder: "Reciter name (e.g. Aasim al-Kufi)",
    riwayaPlaceholder: "Riwaya name (e.g. Hafs an Aasim)",
    addingLabel: "Adding...",
    addButtonLabel: "+ Add",
    addRiwayaFailed: "Failed to add the riwaya",
    confirmDeleteRiwaya: 'Delete the riwaya "{riwaya}" from the list?',
    deleteRiwayaFailed: "Failed to delete the riwaya",
    currentQiraatTitle: "Current Qira'at",
    noQiraatYet: "No qira'at yet.",
    deleteTitle: "Delete",

    loadQiraatFailed: "Failed to load the qira'at list. Please reload the page.",
    loadingQiraat: "Loading qira'at...",

    showing: "Showing",
    of: "of",
    previous: "Previous",
    next: "Next",
  },
} as const;
