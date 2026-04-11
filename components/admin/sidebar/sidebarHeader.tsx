import { cn } from "@/lib/utils";
import type { UserInfo } from "@/lib/types/adminSidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AdminSidebarHeaderProps {
  collapsed: boolean;
  user?: UserInfo | null;
}

export function AdminSidebarHeader({ collapsed, user }: AdminSidebarHeaderProps) {
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
    </>
  );
}
