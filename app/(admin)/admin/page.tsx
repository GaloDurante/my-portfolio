import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

import db from "@/db";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";

export const metadata: Metadata = {
  title: "Admin | Portfolio Galo Durante",
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [currentUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1);

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            {currentUser.avatar ? (
              <Avatar>
                <AvatarImage src={currentUser.avatar} />

                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="size-8 rounded-full bg-muted flex items-center justify-center border">
                <User className="text-muted-foreground" size={16} />
              </div>
            )}
            <span className="text-sm text-muted-foreground">{session.user?.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">Projects</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">Technologies</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <Link href={"/admin/settings"} className="rounded-lg border bg-card p-6 hover:scale-101 transition-transform">
            <h3 className="text-lg font-semibold">Profile</h3>
            <p className="text-sm text-muted-foreground">Customize your profile</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
