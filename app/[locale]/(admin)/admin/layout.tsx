import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { AdminSidebar } from "@/components/admin/sidebar/adminSidebar";
import { getUserById } from "@/lib/services/user";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser = await getUserById(session.user.id);

  const cookieStore = await cookies();
  const collapsed = cookieStore.get("sidebar-collapsed")?.value === "true";
  const themeInitial = cookieStore.get("theme")?.value || "system";

  return (
    <div className="flex h-screen">
      <AdminSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          image: currentUser?.avatar || null,
        }}
        collapsedInitial={collapsed}
        themeInitial={themeInitial}
      />
      <div className="flex-1 overflow-y-auto p-8">{children}</div>
    </div>
  );
}
