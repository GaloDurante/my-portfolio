"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { UserInfo } from "@/lib/types/adminSidebar";

import { Separator } from "@/components/ui/separator";
import { AdminSidebarHeader } from "@/components/admin/sidebar/sidebarHeader";
import { AdminSidebarBody } from "@/components/admin/sidebar/sidebarBody";
import { AdminSidebarFooter } from "@/components/admin/sidebar/sidebarFooter";

interface AdminSidebarProps {
  user?: UserInfo | null;
}
export function AdminSidebar({ user }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col bg-card transition-all duration-300 border-r",
        collapsed ? "w-16" : "w-56",
      )}
    >
      <AdminSidebarHeader collapsed={collapsed} user={user} />

      <Separator className="my-2" />

      <AdminSidebarBody collapsed={collapsed} />

      <Separator className="my-2" />

      <AdminSidebarFooter collapsed={collapsed} setCollapsed={setCollapsed} />
    </aside>
  );
}
