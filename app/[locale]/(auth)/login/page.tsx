import { getTranslations } from "next-intl/server";

import { LockKeyhole } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login | Portfolio Galo Durante",
  description: "Login to access the Admin area",
} as const;

export default async function AuthLoginPage() {
  const t = await getTranslations("auth.login");

  return (
    <section className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-primary/10">
            <LockKeyhole className="size-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("description")}</p>
        </div>

        <LoginForm />
      </div>
    </section>
  );
}
