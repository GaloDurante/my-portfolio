import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

import "@/app/[locale]/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Portfolio Galo Durante",
  description: "Portfolio of Galo Durante",
};

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "system";

  return (
    <html suppressHydrationWarning lang="en" className={cn(inter.className, theme === "dark" && "dark")}>
      <body className="antialiased bg-background overflow-hidden">
        <ThemeProvider attribute="class" defaultTheme={theme} enableSystem disableTransitionOnChange>
          <Providers>
            <NextIntlClientProvider>
              <main>{children}</main>
            </NextIntlClientProvider>
            <Toaster position="top-center" richColors />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
