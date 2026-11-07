"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import { makeT } from "@/i18n/t";
import { admin } from "@/i18n/dictionaries/admin";
import LoadingDots from "./LoadingDots";
import { useToast } from "./ToastProvider";

export default function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
  const router = useRouter();
  const { locale } = useLocale();
  const t = makeT(admin, locale);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(t("confirmDeleteUser").replace("{name}", userName));
    if (!confirmed) return;

    setLoading(true);
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showToast(data.error || t("deleteUserFailed"), "error");
      return;
    }
    showToast(t("deleteUserSuccessToast"), "success");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-2 rounded-full transition disabled:opacity-50"
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          {t("deletingLabel")}
          <LoadingDots />
        </span>
      ) : (
        t("deleteLabel")
      )}
    </button>
  );
}
