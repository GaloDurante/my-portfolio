import { useTheme } from "next-themes";
import { cn, setCustomCookie } from "@/lib/utils";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";

const themeOptions = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
] as const;

interface ThemeSelectorProps {
  collapsed: boolean;
  themeInitial: string;
}

export function ThemeSelector({ themeInitial, collapsed }: ThemeSelectorProps) {
  const t = useTranslations("admin.sidebar.theme");

  const { theme, setTheme } = useTheme();

  const effectiveTheme = theme ?? themeInitial;

  const currentTheme = themeOptions.find((t) => t.value === effectiveTheme);
  const CurrentIcon = currentTheme?.icon ?? Monitor;

  const handleThemeChange = (value: string) => {
    setTheme(value);
    setCustomCookie("theme", value);
  };

  return !collapsed ? (
    <div className="flex items-center justify-between w-full gap-4 px-2">
      <span className="text-sm font-medium">{t("title")}</span>
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn("w-full justify-start gap-2", collapsed && "justify-center")}>
          <CurrentIcon data-icon="inline-start" className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={effectiveTheme} onValueChange={handleThemeChange}>
            {themeOptions.map((option) => {
              const Icon = option.icon;

              return (
                <DropdownMenuRadioItem value={option.value} key={option.value}>
                  <Icon />
                  {t(option.value)}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
