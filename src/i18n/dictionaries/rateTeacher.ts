export const rateTeacher = {
  ar: {
    howWasSessionWith: "كيف كانت حصتك مع {teacherName}؟",
    feedbackPlaceholder: "أخبرنا عن تجربتك (اختياري)",
    submit: "إرسال التقييم",
    submitting: "جارٍ الإرسال...",
    thankYouTitle: "شكرًا على تقييمك!",
    youRated: "لقد قيّمت {teacherName}",
    genericError: "حدث خطأ أثناء الإرسال، حاول مرة أخرى",
  },
  en: {
    howWasSessionWith: "How was your session with {teacherName}?",
    feedbackPlaceholder: "Tell us about your experience (optional)",
    submit: "Submit Rating",
    submitting: "Submitting...",
    thankYouTitle: "Thanks for your rating!",
    youRated: "You rated {teacherName}",
    genericError: "Something went wrong, please try again",
  },
} as const;
