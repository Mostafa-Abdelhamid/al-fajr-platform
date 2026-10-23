"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <main className="flex-1 flex items-center justify-center bg-night px-4 py-14">
      <div className="w-full max-w-md bg-cream rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-extrabold text-night">
            🌅 منصة الفجر
          </Link>
          <p className="text-muted mt-2 text-sm">أنشئ حسابك الآن</p>
        </div>

        <div className="flex gap-3 mb-5">
          <button
            type="button"
            onClick={() => setRole("STUDENT")}
            className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold transition ${
              role === "STUDENT"
                ? "border-dawn bg-orange-50 text-dawn"
                : "border-gray-200 text-muted"
            }`}
          >
            طالب / ولي أمر
          </button>
          <button
            type="button"
            onClick={() => setRole("TEACHER")}
            className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold transition ${
              role === "TEACHER"
                ? "border-dawn bg-orange-50 text-dawn"
                : "border-gray-200 text-muted"
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
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:outline-none"
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
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:outline-none"
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
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:outline-none"
              placeholder="6 أحرف على الأقل"
            />
          </div>
          {role === "TEACHER" && (
            <div>
              <label className="block text-sm font-bold text-night mb-1">القراءة التي تُتقنها</label>
              <select
                value={qiraat}
                onChange={(e) => setQiraat(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-dawn focus:outline-none"
              >
                <option>حفص عن عاصم</option>
                <option>ورش عن نافع</option>
                <option>قالون عن نافع</option>
                <option>قراءة أخرى</option>
              </select>
            </div>
          )}

          {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-l from-dawn to-gold text-white font-bold py-3 shadow-lg shadow-orange-300/40 hover:-translate-y-0.5 transition disabled:opacity-60"
          >
            {loading ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-5">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="text-dawn font-bold">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </main>
  );
}
