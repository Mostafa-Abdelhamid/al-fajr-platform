import { redirect } from "next/navigation";
import { getCurrentUser, dashboardPathForRole } from "@/lib/auth";
import DashboardNav from "@/components/DashboardNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect(dashboardPathForRole(user.role));

  return (
    <div className="flex-1 flex flex-col">
      <DashboardNav name={user.name} avatarEmoji={user.avatarEmoji} role="ADMIN" />
      <main className="flex-1 bg-[#fdf6ea]">
        <div className="max-w-6xl mx-auto px-5 py-10">{children}</div>
      </main>
    </div>
  );
}
