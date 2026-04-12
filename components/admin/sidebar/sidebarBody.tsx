"use client";
import { useTranslations } from "next-intl";

import { useTheme } from "next-themes";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

import { signOutAction } from "@/lib/actions/auth";
import { cn, setCustomCookie } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { LayoutDashboard, FolderOpen, Cpu, User, LogOut, Moon, Sun, Monitor, Languages } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

const themeOptions = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
] as const;

const navItems = [
  { value: "dashboard", href: "/admin", icon: LayoutDashboard },
  { value: "projects", href: "/admin/projects", icon: FolderOpen },
  { value: "technologies", href: "/admin/technologies", icon: Cpu },
  { value: "profile", href: "/admin/profile", icon: User },
];

const languageOptions = [{ value: "en" }, { value: "es" }] as const;

interface AdminSidebarBodyProps {
  collapsed: boolean;
  themeInitial: string;
}

export function AdminSidebarBody({ collapsed, themeInitial }: AdminSidebarBodyProps) {
  const t = useTranslations("AdminSidebar");

  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const effectiveTheme = theme ?? themeInitial;

  const currentTheme = themeOptions.find((t) => t.value === effectiveTheme);
  const CurrentIcon = currentTheme?.icon ?? Monitor;

  const currentLanguage = languageOptions.find((l) => l.value === locale);

  const handleThemeChange = (value: string) => {
    setTheme(value);
    setCustomCookie("theme", value);
  };

  const handleLanguageChange = (value: string) => {
    router.replace(pathname, { locale: value });
  };

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
        {!collapsed ? (
          <div className="flex items-center justify-between w-full gap-4 px-2">
            <span className="text-sm font-medium">{t("theme.title")}</span>
            <div className="flex items-center p-1 rounded-full border">
              {themeOptions.map((option) => (
                <Button
                  size="icon-sm"
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={cn(
                    "cursor-pointer flex items-center justify-center rounded-full p-1.5 transition-all",
                    effectiveTheme === option.value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground bg-transparent hover:bg-muted",
                  )}
                >
                  <option.icon size={14} />
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn("w-full justify-start gap-2", collapsed && "justify-center")}>
                  <CurrentIcon data-icon="inline-start" className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{t("theme.label")}</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={effectiveTheme} onValueChange={handleThemeChange}>
                    {themeOptions.map((option) => {
                      const Icon = option.icon;

                      return (
                        <DropdownMenuRadioItem value={option.value} key={option.value}>
                          <Icon />
                          {t(`theme.${option.value}`)}
                        </DropdownMenuRadioItem>
                      );
                    })}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <div className={cn("px-2", !collapsed && "flex items-center justify-between w-full gap-4")}>
          {!collapsed && <span className="text-sm font-medium">{t("language.title")}</span>}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={collapsed ? "ghost" : "outline"}
                size="sm"
                className={cn(!collapsed ? "justify-between" : "w-full justify-center gap-2")}
              >
                {collapsed ? (
                  <Languages data-icon="inline-start" className="size-4" />
                ) : (
                  t(`language.${currentLanguage?.value}`)
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-52">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{t("language.label")}</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={locale} onValueChange={handleLanguageChange}>
                  {languageOptions.map((option) => (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      {t(`language.${option.value}`)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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
