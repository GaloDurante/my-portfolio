import Link from "next/link";
import { signOutAction } from "@/lib/actions/auth";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FolderOpen, Cpu, User, LogOut } from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FolderOpen,
  },
  {
    label: "Technologies",
    href: "/admin/technologies",
    icon: Cpu,
  },
  {
    label: "User Profile",
    href: "/admin/profile",
    icon: User,
  },
];

interface AdminSidebarBodyProps {
  collapsed: boolean;
}

export function AdminSidebarBody({ collapsed }: AdminSidebarBodyProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto p-2 flex flex-col">
      <ul className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  collapsed && "justify-center",
                  isActive && "bg-accent text-accent-foreground",
                )}
                asChild
              >
                <Link href={item.href}>
                  <Icon data-icon="inline-start" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>

      <form action={signOutAction} className="mt-auto">
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-2", collapsed && "justify-center")}
          type="submit"
        >
          <LogOut data-icon="inline-start" />
          {!collapsed && "Sign out"}
        </Button>
      </form>
    </nav>
  );
}
