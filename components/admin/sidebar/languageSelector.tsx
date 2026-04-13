import { useTranslations } from "next-intl";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

const languageOptions = [{ value: "en" }, { value: "es" }] as const;

interface LanguageSelectorProps {
  collapsed: boolean;
}

export function LanguageSelector({ collapsed }: LanguageSelectorProps) {
  const pathname = usePathname();

  const t = useTranslations("admin.sidebar.language");

  const router = useRouter();
  const locale = useLocale();
  const currentLanguage = languageOptions.find((l) => l.value === locale) || languageOptions[0];

  const handleLanguageChange = (value: string) => {
    router.replace(pathname, { locale: value });
  };

  return (
    <div className={cn(!collapsed && "flex items-center justify-between w-full gap-4 px-2")}>
      {!collapsed && <span className="text-sm font-medium">{t("title")}</span>}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={collapsed ? "ghost" : "outline"}
            size="sm"
            className={cn("justify-start gap-2", collapsed && "w-full justify-center")}
          >
            {collapsed ? <Languages data-icon="inline-start" className="size-4" /> : t(currentLanguage.value)}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={locale} onValueChange={handleLanguageChange}>
              {languageOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {t(option.value)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
