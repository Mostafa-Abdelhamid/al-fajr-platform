"use client";

import { useEffect, useState } from "react";

type QiraatGroup = { reciter: string; riwayat: { id: string; riwaya: string }[] };

export default function QiraatMultiSelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [groups, setGroups] = useState<QiraatGroup[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/qiraat")
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data) => setGroups(data.groups))
      .catch(() => setError(true));
  }, []);

  function toggle(riwaya: string) {
    if (value.includes(riwaya)) {
      onChange(value.filter((v) => v !== riwaya));
    } else {
      onChange([...value, riwaya]);
    }
  }

  if (error) {
    return (
      <p className="text-sm text-red-600 font-semibold bg-red-50 rounded-xl px-4 py-3">
        تعذّر تحميل قائمة القراءات. الرجاء إعادة تحميل الصفحة.
      </p>
    );
  }

  if (!groups) {
    return (
      <div className="rounded-xl border-2 border-gray-200 p-3 h-56 flex items-center justify-center">
        <p className="text-sm text-muted">جارٍ تحميل القراءات...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-gray-200 p-3 max-h-56 overflow-y-auto space-y-3">
      {groups.map((group) => (
        <div key={group.reciter}>
          <p className="text-xs font-bold text-muted mb-1.5">{group.reciter}</p>
          <div className="flex flex-wrap gap-2">
            {group.riwayat.map((r) => {
              const selected = value.includes(r.riwaya);
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => toggle(r.riwaya)}
                  className={`text-xs font-bold px-3 py-2 rounded-xl border-2 transition ${
                    selected
                      ? "border-dawn bg-orange-50 text-dawn"
                      : "border-gray-200 text-muted hover:border-gray-300"
                  }`}
                >
                  {selected && "✓ "}
                  {r.riwaya}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
