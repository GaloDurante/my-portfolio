import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Portfolio Galo Durante",
  description: "Portfolio of Galo Durante",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "system";

  return (
    <html suppressHydrationWarning lang="en" className={cn(inter.className, theme === "dark" && "dark")}>
      <body className="antialiased bg-background">
        <ThemeProvider attribute="class" defaultTheme={theme} enableSystem disableTransitionOnChange>
          <Providers>
            <main>{children}</main>
            <Toaster position="top-center" richColors />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
