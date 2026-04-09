import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminDashboardData } from "@/lib/services/user";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FolderOpen, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin | Portfolio Galo Durante",
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { currentUser, projectCount, techCount } = await getAdminDashboardData({ userId: session.user.id });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          {`Welcome back, ${currentUser?.name || "Admin"}. Here is a look at your current portfolio's status.`}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/projects">
          <Card className="transition-transform hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen data-icon="inline-start" />
                Projects
              </CardTitle>
              <CardDescription>Manage your portfolio projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{projectCount}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/technologies">
          <Card className="transition-transform hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu data-icon="inline-start" />
                Technologies
              </CardTitle>
              <CardDescription>Manage your tech stack</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{techCount}</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
