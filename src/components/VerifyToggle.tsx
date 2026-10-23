"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyToggle({
  teacherProfileId,
  initialVerified,
}: {
  teacherProfileId: string;
  initialVerified: boolean;
}) {
  const router = useRouter();
  const [verified, setVerified] = useState(initialVerified);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const res = await fetch(`/api/admin/teachers/${teacherProfileId}/verify`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setVerified(data.isVerified);
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`text-xs font-bold px-4 py-2 rounded-full transition ${
        verified
          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700"
          : "bg-orange-100 text-dawn hover:bg-green-100 hover:text-green-700"
      }`}
    >
      {verified ? "✅ موثّق — إلغاء التوثيق" : "⏳ غير موثّق — توثيق الآن"}
    </button>
  );
}
