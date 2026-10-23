"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ ما");
        setLoading(false);
        return;
      }
      const dest =
        data.role === "TEACHER"
          ? "/teacher/dashboard"
          : data.role === "ADMIN"
          ? "/admin/dashboard"
          : "/student/dashboard";
      router.push(dest);
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم");
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center bg-night px-4 py-14">
      <div className="w-full max-w-md bg-cream rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-extrabold text-night">
            🌅 منصة الفجر
          </Link>
          <p className="text-muted mt-2 text-sm">أهلًا بعودتك</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-night mb-1">البريد الإلكتروني</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:outline-none"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-night mb-1">كلمة المرور</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-l from-dawn to-gold text-white font-bold py-3 shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 transition disabled:opacity-60"
          >
            {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-5">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="text-dawn font-bold">
            سجّل الآن
          </Link>
        </p>

        <div className="mt-6 border-t pt-4 text-xs text-muted text-center leading-6">
          للتجربة السريعة (بيانات تجريبية مُهيّأة):
          <br />
          طالب: <b dir="ltr">student@fajr.app</b> / <b dir="ltr">123456</b>
          <br />
          معلم: <b dir="ltr">teacher@fajr.app</b> / <b dir="ltr">123456</b>
          <br />
          مدير: <b dir="ltr">admin@fajr.app</b> / <b dir="ltr">123456</b>
        </div>
      </div>
    </main>
  );
}
