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
      <div className={cn("flex h-14 items-center p-2", collapsed && "justify-center")}>
        {user?.image ? (
          <Avatar className={cn("size-8", collapsed && "mx-auto")}>
            <AvatarImage src={user.image} alt={user.name ?? "username"} />
            <AvatarFallback>
              <span className="text-muted-foreground">{user?.name?.[0]?.toUpperCase()}</span>
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="size-8 rounded-full bg-muted flex items-center justify-center border">
            <span className="text-muted-foreground">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
        )}
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
