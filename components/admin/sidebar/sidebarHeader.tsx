import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import type { UserInfo } from "@/lib/types/adminSidebar";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface AdminSidebarHeaderProps {
  collapsed: boolean;
  user?: UserInfo | null;
}

export function AdminSidebarHeader({ collapsed, user }: AdminSidebarHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const currentTheme = themeOptions.find((t) => t.value === theme);
  const CurrentIcon = currentTheme?.icon ?? Monitor;

  return (
    <>
      <div className={cn("flex h-14 items-center pl-4 pr-2", collapsed && "px-2")}>
        <Avatar className={cn("size-8", collapsed && "mx-auto")}>
          {user?.image ? (
            <AvatarImage src={user.image} alt={user.name ?? "username"} />
          ) : (
            <AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
          )}
        </Avatar>
        {!collapsed && (
          <div className="ml-3 flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium">{user?.name ?? "Admin"}</span>
            <span className="truncate text-xs text-muted-foreground">{user?.email ?? ""}</span>
          </div>
        )}
      </div>

      {!collapsed ? (
        <div className="flex items-center justify-between w-full gap-4 pl-4 pr-2">
          <span className="text-sm font-medium">Theme</span>
          <div className="flex items-center p-1 rounded-full border">
            {themeOptions.map((option) => (
              <Button
                size="icon-sm"
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "cursor-pointer flex items-center justify-center rounded-full p-1.5 transition-all",
                  mounted && theme === option.value
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
                  <DropdownMenuItem key={option.value} onClick={() => setTheme(option.value)}>
                    <Icon data-icon="inline-start" className="size-4" />
                    {option.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
}
