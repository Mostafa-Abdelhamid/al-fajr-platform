import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardNav from "@/components/DashboardNav";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex-1 flex flex-col">
      <DashboardNav
        name={user.name}
        avatarEmoji={user.avatarEmoji}
        role={user.role as "STUDENT" | "TEACHER" | "ADMIN"}
        points={user.points}
        streak={user.streak}
      />
      <main className="flex-1 bg-[#fdf6ea]">
        <div className="max-w-6xl mx-auto px-5 py-10">{children}</div>
      </main>
    </div>
  );
}
