"use client";

import { cn } from "@/lib/utils";
import type { UserInfo } from "@/lib/types/adminSidebar";

import { useSidebarCollapsed } from "@/lib/hooks/adminSidebar/useSidebarCollapsed";

import { Separator } from "@/components/ui/separator";
import { AdminSidebarHeader } from "@/components/admin/sidebar/sidebarHeader";
import { AdminSidebarBody } from "@/components/admin/sidebar/sidebarBody";
import { AdminSidebarFooter } from "@/components/admin/sidebar/sidebarFooter";

interface AdminSidebarProps {
  user?: UserInfo | null;
  collapsedInitial: boolean;
  themeInitial: string;
}

export function AdminSidebar({ user, collapsedInitial, themeInitial }: AdminSidebarProps) {
  const { collapsed, toggleCollapsed } = useSidebarCollapsed(collapsedInitial);

  return (
    <aside
      className={cn("relative flex h-full flex-col bg-card transition-all duration-300", collapsed ? "w-16" : "w-56")}
    >
      <AdminSidebarHeader collapsed={collapsed} user={user} />

      <Separator className="my-2" />

      <AdminSidebarBody collapsed={collapsed} themeInitial={themeInitial} />

      <Separator className="my-2" />

      <AdminSidebarFooter collapsed={collapsed} onToggle={toggleCollapsed} />
    </aside>
  );
}
