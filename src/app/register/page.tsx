"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [qiraat, setQiraat] = useState("حفص عن عاصم");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, qiraat }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ ما");
        setLoading(false);
        return;
      }
      router.push(role === "TEACHER" ? "/teacher/dashboard" : "/student/dashboard");
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم");
      setLoading(false);
    }
  }

  return (
    <AuthShell eyebrow="انضم إلينا" headline="ابدأ رحلتك في تعلّم القرآن والقراءات اليوم">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl shadow-night/10 animate-scale-in">
        <div className="text-center mb-6">
          <Link href="/" className="lg:hidden text-2xl font-extrabold text-night">
            🌅 منصة الفجر
          </Link>
          <h2 className="text-xl font-extrabold text-night mt-1">إنشاء حساب جديد</h2>
          <p className="text-muted mt-1 text-sm">أنشئ حسابك وابدأ في أقل من دقيقة</p>
        </div>

        <div className="flex gap-3 mb-5 bg-gray-50 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole("STUDENT")}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
              role === "STUDENT"
                ? "bg-white text-dawn shadow-sm"
                : "text-muted hover:text-night"
            }`}
          >
            طالب / ولي أمر
          </button>
          <button
            type="button"
            onClick={() => setRole("TEACHER")}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
              role === "TEACHER"
                ? "bg-white text-dawn shadow-sm"
                : "text-muted hover:text-night"
            }`}
          >
            معلم / معلمة
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-night mb-1">الاسم الكامل</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
              placeholder="اكتب اسمك الكامل"
            />
          </div>
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
            <label className="block text-sm font-bold text-night mb-1">كلمة المرور</label>
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
              placeholder="6 أحرف على الأقل"
            />
          </div>
          {role === "TEACHER" && (
            <div className="animate-fade-up">
              <label className="block text-sm font-bold text-night mb-1">القراءة التي تُتقنها</label>
              <select
                value={qiraat}
                onChange={(e) => setQiraat(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:ring-4 focus:ring-dawn/10 focus:outline-none transition-shadow"
              >
                <option>حفص عن عاصم</option>
                <option>ورش عن نافع</option>
                <option>قالون عن نافع</option>
                <option>قراءة أخرى</option>
              </select>
            </div>
          )}

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
            {loading ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="text-dawn font-bold hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
