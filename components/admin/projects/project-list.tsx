import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { Pencil, Star, StarOff } from "lucide-react";
import type { ProjectType } from "@/lib/types/project";

import { format } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { getLocale } from "next-intl/server";

interface ProjectListProps {
  projects: ProjectType[];
  userId: string;
}

export async function ProjectList({ projects, userId }: ProjectListProps) {
  const t = await getTranslations("admin.projects.list");

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-semibold">{t("empty")}</h3>
        <p className="text-muted-foreground mt-1">{t("emptyDescription")}</p>
      </div>
    );
  }

  const locale = await getLocale();

  const dateLocaleMap = {
    en: enUS,
    es: es,
  };

  const dateLocale = dateLocaleMap[locale as keyof typeof dateLocaleMap] ?? enUS;

  function formatDate(date: Date | string) {
    return format(new Date(date), "PPP", { locale: dateLocale });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("columns.title")}</TableHead>
          <TableHead>{t("columns.slug")}</TableHead>
          <TableHead>{t("columns.status.label")}</TableHead>
          <TableHead>{t("columns.featured")}</TableHead>
          <TableHead>{t("columns.lastUpdated")}</TableHead>
          <TableHead className="text-right">{t("columns.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.title}</TableCell>
            <TableCell>
              <code className="bg-muted px-2 py-1 rounded text-xs">{project.slug}</code>
            </TableCell>
            <TableCell>
              <Badge variant={project.status === "published" ? "default" : "secondary"}>
                {t(`columns.status.options.${project.status}`)}
              </Badge>
            </TableCell>
            <TableCell>
              {project.featured ? (
                <Star className="size-4 text-yellow-500" />
              ) : (
                <StarOff className="size-4 text-muted-foreground" />
              )}
            </TableCell>
            <TableCell className="font-medium">{formatDate(new Date())}</TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/projects/${project.id}/edit`}>
                    <Pencil data-icon="inline-start" />
                    {t("buttons.edit")}
                  </Link>
                </Button>
                {/* <DeleteButton /> */}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
