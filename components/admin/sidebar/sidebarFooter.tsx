import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminSidebarFooterProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebarFooter({ collapsed, onToggle }: AdminSidebarFooterProps) {
  const t = useTranslations("admin.sidebar");

  return (
    <div className="px-2 pb-2">
      <Button variant="ghost" size="sm" className={cn("w-full", collapsed && "justify-center")} onClick={onToggle}>
        {collapsed ? (
          <ChevronRight data-icon="inline-end" />
        ) : (
          <>
            <ChevronLeft data-icon="inline-start" />
            <span>{t("collapse")}</span>
          </>
        )}
      </Button>
    </div>
  );
}
