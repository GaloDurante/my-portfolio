import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";

import { signOutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { LayoutDashboard, FolderOpen, Cpu, User, LogOut } from "lucide-react";
import { ThemeSelector } from "@/components/admin/sidebar/themeSelector";
import { LanguageSelector } from "@/components/admin/sidebar/languageSelector";

const navItems = [
  { value: "dashboard", href: "/admin", icon: LayoutDashboard },
  { value: "projects", href: "/admin/projects", icon: FolderOpen },
  { value: "technologies", href: "/admin/technologies", icon: Cpu },
  { value: "profile", href: "/admin/profile", icon: User },
];

interface AdminSidebarBodyProps {
  collapsed: boolean;
  themeInitial: string;
}

export function AdminSidebarBody({ collapsed, themeInitial }: AdminSidebarBodyProps) {
  const t = useTranslations("AdminSidebar");

  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto p-2 flex flex-col overflow-x-hidden">
      <ul className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  collapsed && "justify-center",
                  isActive && "bg-accent text-accent-foreground",
                )}
                asChild
              >
                <Link href={item.href}>
                  <Icon data-icon="inline-start" />
                  {!collapsed && <span>{t(`nav.${item.value}`)}</span>}
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto space-y-2">
        <ThemeSelector collapsed={collapsed} themeInitial={themeInitial} />
        <LanguageSelector collapsed={collapsed} />

        <form action={signOutAction}>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", collapsed && "justify-center")}
            type="submit"
          >
            <LogOut data-icon="inline-start" />
            {!collapsed && t("signOut")}
          </Button>
        </form>
      </div>
    </nav>
  );
}
