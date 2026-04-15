"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Layers, Image, BookText } from "lucide-react";

const navItems = [
  { value: "basic", icon: Layers },
  { value: "media", icon: Image },
  { value: "details", icon: BookText },
];

export function ProjectNavigation() {
  const t = useTranslations("admin.projects.form.nav");

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium">{t("title")}</h2>
      <ul>
        {navItems.map((item) => (
          <li key={item.value} className="text-sm text-muted-foreground">
            <Button variant="ghost">
              <item.icon />
              {t(item.value)}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
