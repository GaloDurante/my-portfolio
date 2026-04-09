import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface AdminSidebarFooterProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function AdminSidebarFooter({ collapsed, setCollapsed }: AdminSidebarFooterProps) {
  return (
    <div className="px-2 pb-2">
      <Button
        variant="ghost"
        size="sm"
        className={cn("w-full", collapsed && "justify-center")}
        onClick={() => setCollapsed(!collapsed)}
      >
        <ChevronLeft data-icon="inline-start" />
        {!collapsed && <span>Collapse</span>}
      </Button>
    </div>
  );
}
