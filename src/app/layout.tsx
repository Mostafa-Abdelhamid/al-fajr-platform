import { Cairo } from "next/font/google";
import { getLocale } from "@/i18n/getLocale";
import { dirForLocale } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { ToastProvider } from "@/components/ToastProvider";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export async function generateMetadata() {
  const locale = await getLocale();
  return locale === "en"
    ? {
        title: "Al-Fajr Platform — Learn Quran & Qira'at",
        description:
          "Al-Fajr connects you with Quran and Qira'at teachers through live video calls, a schedule that fits you, and real progress tracking.",
      }
    : {
        title: "منصة الفجر — تعلّم القرآن والقراءات",
        description:
          "منصة الفجر تربطك بمعلمي القرآن والقراءات عبر مكالمات فيديو مباشرة، بجدول يناسبك ومتابعة حقيقية لتقدمك.",
      };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html lang={locale} dir={dirForLocale(locale)} className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
        <LocaleProvider initialLocale={locale}>
          <ToastProvider>{children}</ToastProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
