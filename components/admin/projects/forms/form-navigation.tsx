import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Layers, Image, BookText } from "lucide-react";

export type ProjectTab = "basic" | "media" | "details";
interface NavItem {
  value: ProjectTab;
  icon: typeof Layers;
}

const navItems: NavItem[] = [
  { value: "basic", icon: Layers },
  { value: "media", icon: Image },
  { value: "details", icon: BookText },
];

interface ProjectNavigationProps {
  activeTab: ProjectTab;
  onTabChange: (tab: ProjectTab) => void;
}

export function ProjectNavigation({ activeTab, onTabChange }: ProjectNavigationProps) {
  const t = useTranslations("admin.projects.form.nav");

  const isActive = (tab: ProjectTab) => activeTab === tab;

  return (
    <div className="w-full h-fit">
      <h2 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wide">{t("title")}</h2>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.value);

          return (
            <Button
              key={item.value}
              variant="ghost"
              className={cn(
                "justify-start gap-3 px-3 py-2 text-left transition-all duration-200",
                active && "bg-primary/10 text-primary hover:bg-primary/15",
              )}
              onClick={() => onTabChange(item.value)}
            >
              <Icon className={cn("h-4 w-4", active && "text-primary")} />
              <span className="flex-1 font-medium">{t(item.value)}</span>
              {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
