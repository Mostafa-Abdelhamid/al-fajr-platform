import Link from "next/link";
import { getLocale } from "@/i18n/getLocale";
import { makeT } from "@/i18n/t";
import { landing } from "@/i18n/dictionaries/landing";
import { nav } from "@/i18n/dictionaries/nav";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default async function Home() {
  const locale = await getLocale();
  const t = makeT(landing, locale);
  const tNav = makeT(nav, locale);

  const FEATURES = [
    { icon: "👨‍🏫", title: t("feature1Title"), desc: t("feature1Desc") },
    { icon: "🎥", title: t("feature2Title"), desc: t("feature2Desc") },
    { icon: "📅", title: t("feature3Title"), desc: t("feature3Desc") },
    { icon: "📈", title: t("feature4Title"), desc: t("feature4Desc") },
  ];

  const STEPS = [
    { num: 1, title: t("step1Title"), desc: t("step1Desc") },
    { num: 2, title: t("step2Title"), desc: t("step2Desc") },
    { num: 3, title: t("step3Title"), desc: t("step3Desc") },
  ];

  const FAQS = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
  ];

  const STATS: [string, string][] = [
    [t("statQuick"), t("statQuickDesc")],
    [t("statVideo"), t("statVideoDesc")],
    [t("statSchedule"), t("statScheduleDesc")],
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-cream/80 backdrop-blur-lg border-b border-black/5">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="font-extrabold text-xl text-night flex items-center gap-2">
            <span className="animate-float inline-block">🌅</span> {tNav("brand")}
          </div>
          <nav className="hidden sm:flex items-center gap-7">
            <a href="#features" className="text-sm font-semibold hover:text-dawn transition">{t("navFeatures")}</a>
            <a href="#how" className="text-sm font-semibold hover:text-dawn transition">{t("navHow")}</a>
            <a href="#faq" className="text-sm font-semibold hover:text-dawn transition">{t("navFaq")}</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-bold text-night hidden sm:inline">
              {t("navLogin")}
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-l from-dawn to-gold text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 transition"
            >
              {t("navRegister")}
            </Link>
            <LocaleSwitcher variant="light" />
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-fajr-night text-white py-28">
        <div className="absolute inset-0 bg-dot-grid opacity-40" />
        <div className="fajr-orb w-96 h-96 bg-gold/25 -top-20 -right-20" />
        <div className="fajr-orb w-80 h-80 bg-dawn/25 bottom-0 -left-10" />
        <div className="relative max-w-3xl mx-auto px-5 flex flex-col items-center text-center gap-6">
          <span className="animate-fade-up inline-flex items-center gap-2 bg-white/10 border border-white/25 px-5 py-2 rounded-full text-sm font-bold text-gold-light">
            {t("heroBadge")}
          </span>
          <h1 className="animate-fade-up stagger-1 text-4xl sm:text-5xl font-extrabold leading-snug">
            {t("heroTitlePrefix")}{" "}
            <span className="bg-gradient-to-l from-gold-light to-dawn bg-clip-text text-transparent">
              {t("heroTitleHighlight")}
            </span>{" "}
            {t("heroTitleSuffix")}
          </h1>
          <p className="animate-fade-up stagger-2 text-lg text-gray-300 max-w-xl">
            {t("heroSubtitle")}
          </p>
          <div className="animate-fade-up stagger-3 flex flex-wrap gap-4 justify-center mt-2">
            <Link
              href="/register"
              className="bg-gradient-to-l from-dawn to-gold text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 hover:shadow-orange-300/60 transition-all"
            >
              {t("heroCtaPrimary")}
            </Link>
            <a
              href="#features"
              className="border-2 border-white text-white font-bold px-7 py-3.5 rounded-full hover:bg-white hover:text-night transition-all"
            >
              {t("heroCtaSecondary")}
            </a>
          </div>
          <div className="animate-fade-up stagger-4 flex gap-10 mt-10 flex-wrap justify-center">
            {STATS.map(([a, b]) => (
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
            <span className="text-dawn font-bold text-sm">{t("featuresEyebrow")}</span>
            <h2 className="text-3xl font-extrabold text-night mt-2">{t("featuresTitle")}</h2>
            <p className="text-muted mt-3">{t("featuresSubtitle")}</p>
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
            <span className="text-dawn font-bold text-sm">{t("howEyebrow")}</span>
            <h2 className="text-3xl font-extrabold text-night mt-2">{t("howTitle")}</h2>
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
              <h3 className="text-2xl font-extrabold mb-2">{t("teacherCtaTitle")}</h3>
              <p className="text-gray-300 max-w-md">
                {t("teacherCtaDesc")}
              </p>
            </div>
            <Link
              href="/register"
              className="relative bg-gradient-to-l from-dawn to-gold text-white font-bold px-7 py-3.5 rounded-full hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-400/30 transition-all"
            >
              {t("teacherCtaButton")}
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-14">
            <span className="text-dawn font-bold text-sm">{t("faqEyebrow")}</span>
            <h2 className="text-3xl font-extrabold text-night mt-2">{t("faqTitle")}</h2>
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
        <div className="relative font-extrabold text-white text-lg mb-2">🌅 {tNav("brand")}</div>
        <p className="relative text-sm">{t("footerTagline")}</p>
      </footer>
    </>
  );
}
