import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Portfolio Galo Durante",
};

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
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
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">Profile</h3>
            <p className="text-sm text-muted-foreground">Complete your profile</p>
          </div>
        </div>
      </div>
    </div>
  );
}
