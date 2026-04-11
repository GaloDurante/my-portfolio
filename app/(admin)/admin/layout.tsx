import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar/adminSidebar";

import db from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1);

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          image: currentUser?.avatar || null,
        }}
      />
      <div className="flex flex-1 flex-col overflow-y-auto p-8">{children}</div>
    </div>
  );
}
