"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { signOutAction } from "@/lib/actions/auth";
import { cn, setThemeCookie } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { LayoutDashboard, FolderOpen, Cpu, User, LogOut, Moon, Sun, Monitor } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const themeOptions = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
] as const;

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Technologies", href: "/admin/technologies", icon: Cpu },
  { label: "User Profile", href: "/admin/profile", icon: User },
];

interface AdminSidebarBodyProps {
  collapsed: boolean;
  themeInitial: string;
}

export function AdminSidebarBody({ collapsed, themeInitial }: AdminSidebarBodyProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const effectiveTheme = theme ?? themeInitial;

  const currentTheme = themeOptions.find((t) => t.value === effectiveTheme);
  const CurrentIcon = currentTheme?.icon ?? Monitor;

  const handleThemeChange = (value: (typeof themeOptions)[number]["value"]) => {
    setTheme(value);
    setThemeCookie(value);
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
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto space-y-1">
        {!collapsed ? (
          <div className="flex items-center justify-between w-full gap-4 px-2">
            <span className="text-sm font-medium">Theme</span>
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

              <DropdownMenuContent align="start">
                {themeOptions.map((option) => {
                  const Icon = option.icon;

                  return (
                    <DropdownMenuItem key={option.value} onClick={() => handleThemeChange(option.value)}>
                      <Icon data-icon="inline-start" className="size-4" />
                      {option.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <form action={signOutAction}>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", collapsed && "justify-center")}
            type="submit"
          >
            <LogOut data-icon="inline-start" />
            {!collapsed && "Sign out"}
          </Button>
        </form>
      </div>
    </nav>
  );
}
