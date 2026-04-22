import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";

import { updateProjectBasicSchema, type UpdateProjectBasicFormData } from "@/lib/schemas/project";
import { updateProjectBasicAction } from "@/lib/actions/project-actions";
import { generateSlug, applyServerValidationErrors } from "@/lib/utils";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Wand2 } from "lucide-react";

interface ProjectFormBasicProps {
  projectId: string;
  defaultValues?: Partial<UpdateProjectBasicFormData>;
}

export function ProjectFormBasic({ projectId, defaultValues }: ProjectFormBasicProps) {
  const t = useTranslations("admin.projects.form");
  const schema = updateProjectBasicSchema(t);
  const router = useRouter();

  const form = useForm<UpdateProjectBasicFormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const isPending = form.formState.isSubmitting;

  const handleAutoGenerate = () => {
    const title = form.watch("title");
    if (title) {
      form.setValue("slug", generateSlug(title), { shouldValidate: true });
    }
  };

  const onSubmit = form.handleSubmit(async (data) => {
    const result = await updateProjectBasicAction(projectId, data);

    if (!result.success) {
      if (result.code === "VALIDATION_ERROR") {
        applyServerValidationErrors(form, result.errors.fieldErrors);
        return;
      }

      toast.error(t("submit.error.title"), {
        description: result.message,
      });
      return;
    }

    toast.success(t("submit.success.title"), {
      description: t("submit.success.basic"),
    });
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
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
                className="mt-auto text-foreground"
                disabled={!form.watch("title")}
                onClick={handleAutoGenerate}
              >
                <Wand2 size={16} data-icon="inline-start" />
                <span className="hidden md:inline">{t("createModal.buttons.autoGenerate")}</span>
              </Button>
            </div>
            <FieldError>{form.formState.errors.slug?.message}</FieldError>
            <FieldDescription>{t("basic.fields.slug.helper")}</FieldDescription>
          </Field>
        </div>

        <Field data-invalid={!!form.formState.errors.shortDescription}>
          <FieldLabel htmlFor="shortDescription">{t("basic.fields.shortDescription.label")}</FieldLabel>
          <Textarea
            id="shortDescription"
            {...form.register("shortDescription")}
            placeholder={t("basic.fields.shortDescription.placeholder")}
            rows={2}
            aria-invalid={!!form.formState.errors.shortDescription}
          />
          <FieldError>{form.formState.errors.shortDescription?.message}</FieldError>
          <FieldDescription>{t("basic.fields.shortDescription.helper")}</FieldDescription>
        </Field>

        <Field data-invalid={!!form.formState.errors.description}>
          <FieldLabel htmlFor="description">{t("basic.fields.description.label")}</FieldLabel>
          <Textarea
            id="description"
            {...form.register("description")}
            placeholder={t("basic.fields.description.placeholder")}
            rows={6}
            aria-invalid={!!form.formState.errors.description}
          />
          <FieldError>{form.formState.errors.description?.message}</FieldError>
        </Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner data-icon="inline-start" />}
          {t("buttons.save")}
        </Button>
      </div>
    </form>
  );
}
