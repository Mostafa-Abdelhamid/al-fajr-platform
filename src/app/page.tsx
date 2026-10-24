import Link from "next/link";

const FEATURES = [
  {
    icon: "👨‍🏫",
    title: "معلمون موثوقون",
    desc: "معلمون ومعلمات مؤهلون بإجازات في القراءات المختلفة (حفص، ورش، وغيرها).",
  },
  {
    icon: "🎥",
    title: "مكالمات فيديو مباشرة",
    desc: "حصة مباشرة وجهًا لوجه مع معلمك، بجودة عالية وسهولة دخول من أي جهاز.",
  },
  {
    icon: "📅",
    title: "جدول يناسبك",
    desc: "احجز حصتك، وعدّل أو أجّل موعدك بسهولة من لوحة التحكم الخاصة بك.",
  },
  {
    icon: "📈",
    title: "تابع تقدمك",
    desc: "شاهد تقدمك بعد كل حصة، واحصل على نقاط وشارات تحفيزية مع كل إنجاز.",
  },
];

const STEPS = [
  { num: 1, title: "سجّل بياناتك", desc: "أنشئ حسابك واختر القراءة التي تهمك في أقل من دقيقة." },
  { num: 2, title: "اختر معلمك المناسب", desc: "تصفّح المعلمين المتاحين واحجز موعدًا من جدولهم مباشرة." },
  { num: 3, title: "ابدأ حصتك الأولى", desc: "ادخل مكالمة الفيديو في الموعد المحدد وابدأ رحلتك التعليمية." },
];

const FAQS = [
  {
    q: "كم تستغرق الحصة الواحدة؟",
    a: "تستغرق الحصة عادة نحو ساعة واحدة، ويمكنك تحديد ما تريد التركيز عليه قبل بدايتها.",
  },
  {
    q: "هل أحتاج إلى تطبيق خاص؟",
    a: "لا، الحصص تتم عبر مكالمة فيديو تفتح مباشرة من المتصفح، دون الحاجة لتثبيت أي برنامج إضافي.",
  },
  {
    q: "هل يمكنني التسجيل كمعلم؟",
    a: 'بالتأكيد، اختر "معلم / معلمة" عند إنشاء الحساب وابدأ بإضافة أوقات تواجدك فورًا.',
  },
];

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-cream/80 backdrop-blur-lg border-b border-black/5">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="font-extrabold text-xl text-night flex items-center gap-2">
            <span className="animate-float inline-block">🌅</span> منصة الفجر
          </div>
          <nav className="hidden sm:flex items-center gap-7">
            <a href="#features" className="text-sm font-semibold hover:text-dawn transition">المميزات</a>
            <a href="#how" className="text-sm font-semibold hover:text-dawn transition">كيف تعمل</a>
            <a href="#faq" className="text-sm font-semibold hover:text-dawn transition">الأسئلة الشائعة</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-bold text-night hidden sm:inline">
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-l from-dawn to-gold text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 transition"
            >
              سجّل الآن
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-fajr-night text-white py-28">
        <div className="absolute inset-0 bg-dot-grid opacity-40" />
        <div className="fajr-orb w-96 h-96 bg-gold/25 -top-20 -right-20" />
        <div className="fajr-orb w-80 h-80 bg-dawn/25 bottom-0 -left-10" />
        <div className="relative max-w-3xl mx-auto px-5 flex flex-col items-center text-center gap-6">
          <span className="animate-fade-up inline-flex items-center gap-2 bg-white/10 border border-white/25 px-5 py-2 rounded-full text-sm font-bold text-gold-light">
            🎉 النسخة التجريبية متاحة الآن
          </span>
          <h1 className="animate-fade-up stagger-1 text-4xl sm:text-5xl font-extrabold leading-snug">
            تعلّم{" "}
            <span className="bg-gradient-to-l from-gold-light to-dawn bg-clip-text text-transparent">
              القرآن والقراءات
            </span>{" "}
            مباشرة من معلمين مؤهلين
          </h1>
          <p className="animate-fade-up stagger-2 text-lg text-gray-300 max-w-xl">
            منصة الفجر تربطك بمعلمي القرآن عبر مكالمات فيديو مباشرة، بجدول يناسبك، ومتابعة حقيقية لتقدمك خطوة بخطوة.
          </p>
          <div className="animate-fade-up stagger-3 flex flex-wrap gap-4 justify-center mt-2">
            <Link
              href="/register"
              className="bg-gradient-to-l from-dawn to-gold text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 hover:shadow-orange-300/60 transition-all"
            >
              احجز حصتك الأولى
            </Link>
            <a
              href="#features"
              className="border-2 border-white text-white font-bold px-7 py-3.5 rounded-full hover:bg-white hover:text-night transition-all"
            >
              تعرّف أكثر
            </a>
          </div>
          <div className="animate-fade-up stagger-4 flex gap-10 mt-10 flex-wrap justify-center">
            {[
              ["سهل", "تسجيل خلال دقائق"],
              ["فيديو", "مباشر مع المعلم"],
              ["جدول", "مرن حسب وقتك"],
            ].map(([a, b]) => (
              <div key={a} className="text-center">
                <b className="block text-2xl text-gold font-extrabold">{a}</b>
                <span className="text-xs text-gray-400">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-dawn font-bold text-sm">لماذا منصة الفجر</span>
            <h2 className="text-3xl font-extrabold text-night mt-2">تجربة تعليمية متكاملة من أول حصة</h2>
            <p className="text-muted mt-3">كل ما تحتاجه لتعلّم القرآن والقراءات بجدية واستمرارية، في مكان واحد.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`hover-lift animate-fade-up stagger-${Math.min(i + 1, 6)} bg-white border border-[#efe6d8] rounded-2xl p-7 hover:shadow-xl`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#fff3df] to-[#ffe3c9] flex items-center justify-center text-2xl mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-night mb-2">{f.title}</h3>
                <p className="text-sm text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="py-24 bg-[#fff3e4]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-dawn font-bold text-sm">خطوات بسيطة</span>
            <h2 className="text-3xl font-extrabold text-night mt-2">كيف تبدأ في 3 خطوات</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.num} className={`animate-fade-up stagger-${i + 1} text-center px-3`}>
                <div className="w-12 h-12 rounded-full bg-night text-gold font-extrabold flex items-center justify-center mx-auto mb-4 animate-pulse-ring">
                  {s.num}
                </div>
                <h3 className="font-bold text-night mb-2">{s.title}</h3>
                <p className="text-sm text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="relative overflow-hidden bg-fajr-night text-white rounded-[28px] p-10 sm:p-14 flex flex-wrap items-center justify-between gap-7 hover-lift">
            <div className="absolute inset-0 bg-dot-grid opacity-30" />
            <div className="fajr-orb w-56 h-56 bg-gold/30 -top-16 -left-10" />
            <div className="relative">
              <h3 className="text-2xl font-extrabold mb-2">هل أنت معلم/ـة قرآن؟</h3>
              <p className="text-gray-300 max-w-md">
                انضم إلى النسخة التجريبية كمعلم، وابدأ بتدريس طلابك عبر المنصة من أول يوم.
              </p>
            </div>
            <Link
              href="/register"
              className="relative bg-gradient-to-l from-dawn to-gold text-white font-bold px-7 py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-400/30 transition-all"
            >
              سجّل كمعلم
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-14">
            <span className="text-dawn font-bold text-sm">الأسئلة الشائعة</span>
            <h2 className="text-3xl font-extrabold text-night mt-2">كل ما تريد معرفته</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((f, i) => (
              <details
                key={f.q}
                className={`animate-fade-up stagger-${i + 1} group bg-white border border-[#efe6d8] rounded-2xl p-5 open:border-dawn/40 open:shadow-md transition-shadow`}
              >
                <summary className="font-bold text-night cursor-pointer flex justify-between items-center list-none">
                  {f.q}
                  <span className="text-dawn text-xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="text-muted text-sm mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden bg-fajr-night text-gray-400 py-12 text-center">
        <div className="absolute inset-0 bg-dot-grid opacity-20" />
        <div className="relative font-extrabold text-white text-lg mb-2">🌅 منصة الفجر</div>
        <p className="relative text-sm">منصة تعليمية لربط طلاب القرآن والقراءات بالمعلمين — النسخة التجريبية 2026</p>
      </footer>
    </>
  );
}
