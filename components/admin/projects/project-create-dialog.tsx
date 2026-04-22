"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";

import { createProjectAction } from "@/lib/actions/project-actions";
import { applyServerValidationErrors, generateSlug } from "@/lib/utils";
import { createProjectSchema, type CreateProjectFormData } from "@/lib/schemas/project";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Wand2, FolderPlus } from "lucide-react";

interface ProjectCreateDialogProps {
  userId: string;
}

export function ProjectCreateDialog({ userId }: ProjectCreateDialogProps) {
  const t = useTranslations("admin.projects.form");
  const schema = createProjectSchema(t);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
    },
  });

  const handleAutoGenerate = () => {
    const title = form.watch("title");
    if (title) {
      form.setValue("slug", generateSlug(title), { shouldValidate: true });
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset();
    }

    setOpen(nextOpen);
  };

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = await createProjectAction(data, userId);

      if (!result.success) {
        if (result.code === "VALIDATION_ERROR") {
          applyServerValidationErrors(form, result.errors.fieldErrors);
          return;
        }

        toast.error(result.message);
        return;
      }
      toast.success(t("createModal.submit.success"));
      router.push(`/admin/projects/${result.projectId}`);
    });
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <FolderPlus size={16} data-icon="inline-start" />
          {t("createModal.buttons.new")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("createModal.title")}</DialogTitle>
          <DialogDescription>{t("createModal.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field data-invalid={!!form.formState.errors.title}>
            <FieldLabel htmlFor="title">{t("basic.fields.title.label")}</FieldLabel>
            <Input
              id="title"
              {...form.register("title")}
              placeholder={t("basic.fields.title.placeholder")}
              aria-invalid={!!form.formState.errors.title}
            />
            <FieldError>{form.formState.errors.title?.message}</FieldError>
          </Field>

          <Field data-invalid={!!form.formState.errors.slug}>
            <FieldLabel htmlFor="slug">{t("basic.fields.slug.label")}</FieldLabel>
            <div className="flex items-center gap-2">
              <Input
                id="slug"
                {...form.register("slug")}
                placeholder={t("basic.fields.slug.placeholder")}
                aria-invalid={!!form.formState.errors.slug}
              />
              <Button
                type="button"
                variant="outline"
                className="mt-auto text-primary"
                disabled={!form.watch("title")}
                onClick={handleAutoGenerate}
              >
                <Wand2 size={16} />
                {t("createModal.buttons.autoGenerate")}
              </Button>
            </div>
            <FieldError>{form.formState.errors.slug?.message}</FieldError>
          </Field>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("createModal.buttons.cancel")}</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              {t("createModal.buttons.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
