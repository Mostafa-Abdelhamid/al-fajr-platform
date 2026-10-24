"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";

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
    <AuthShell eyebrow="أهلًا بعودتك" headline="واصل رحلتك في حفظ القرآن والقراءات">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl shadow-night/10 animate-scale-in">
        <div className="text-center mb-6">
          <Link href="/" className="lg:hidden text-2xl font-extrabold text-night">
            🌅 منصة الفجر
          </Link>
          <h2 className="text-xl font-extrabold text-night mt-1">تسجيل الدخول</h2>
          <p className="text-muted mt-1 text-sm">أهلًا بعودتك، أدخل بياناتك للمتابعة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-night mb-1">البريد الإلكتروني</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-bold text-night">كلمة المرور</label>
              <Link href="/forgot-password" className="text-xs font-bold text-dawn hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-semibold bg-red-50 rounded-xl px-4 py-3 animate-fade-in">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-l from-dawn to-gold text-white font-bold py-3.5 shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-300/50 transition-all disabled:opacity-60 disabled:translate-y-0"
          >
            {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="text-dawn font-bold hover:underline">
            سجّل الآن
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
