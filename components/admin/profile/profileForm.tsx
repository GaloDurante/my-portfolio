"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";

import { updateProfile } from "@/lib/actions/profile-actions";
import { applyServerValidationErrors } from "@/lib/utils";
import { createProfileSchema, type ProfileFormData } from "@/lib/schemas/profile";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { IdCard, BookText, Globe } from "lucide-react";

interface ProfileFormProps {
  defaultValues: ProfileFormData;
  userId: string;
}

export function ProfileForm({ defaultValues, userId }: ProfileFormProps) {
  const t = useTranslations("admin.profile.form");
  const schema = createProfileSchema(t);
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = await updateProfile(data, userId);

      if (!result.success) {
        if (result.code === "VALIDATION_ERROR") {
          applyServerValidationErrors(form, result.errors.fieldErrors);
          return;
        }

        toast.error(result.message);
        return;
      }

      toast.success(t("submit.success"));
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <div className="space-y-6 rounded-lg border bg-card p-6">
        <div>
          <div className="flex gap-2 items-center">
            <IdCard size={20} />
            <h2 className="text-lg font-semibold">{t("personalInfo.title")}</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{t("personalInfo.description")}</p>
        </div>

        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="name">{t("personalInfo.fields.name.label")}</FieldLabel>
              <Input
                id="name"
                {...form.register("name")}
                placeholder={t("personalInfo.fields.name.placeholder")}
                aria-invalid={!!form.formState.errors.name}
              />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>

            <Field data-invalid={!!form.formState.errors.title}>
              <FieldLabel htmlFor="title">{t("personalInfo.fields.title.label")}</FieldLabel>
              <Input
                id="title"
                {...form.register("title")}
                placeholder={t("personalInfo.fields.title.placeholder")}
                aria-invalid={!!form.formState.errors.title}
              />
              <FieldError>{form.formState.errors.title?.message}</FieldError>
            </Field>

            <Field data-invalid={!!form.formState.errors.email}>
              <FieldLabel htmlFor="email">{t("personalInfo.fields.email.label")}</FieldLabel>
              <Input
                id="email"
                {...form.register("email")}
                placeholder={t("personalInfo.fields.email.placeholder")}
                aria-invalid={!!form.formState.errors.email}
              />
              <FieldError>{form.formState.errors.email?.message}</FieldError>
              <FieldDescription>{t("personalInfo.fields.email.helper")}</FieldDescription>
            </Field>
          </div>
        </FieldGroup>
      </div>

      <div className="space-y-6 rounded-lg border bg-card p-6">
        <div>
          <div className="flex gap-2 items-center">
            <BookText size={20} />
            <h2 className="text-lg font-semibold">{t("about.title")}</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{t("about.description")}</p>
        </div>
        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.shortBio}>
            <FieldLabel htmlFor="shortBio">{t("about.fields.bio.label")}</FieldLabel>
            <Textarea
              id="shortBio"
              {...form.register("shortBio")}
              placeholder={t("about.fields.bio.placeholder")}
              rows={3}
              aria-invalid={!!form.formState.errors.shortBio}
            />
            <FieldDescription>{t("about.fields.bio.helper")}</FieldDescription>
            <FieldError>{form.formState.errors.shortBio?.message}</FieldError>
          </Field>

          <Field data-invalid={!!form.formState.errors.bio}>
            <FieldLabel htmlFor="bio">{t("about.fields.about.label")}</FieldLabel>
            <Textarea
              id="bio"
              {...form.register("bio")}
              placeholder={t("about.fields.about.placeholder")}
              rows={6}
              aria-invalid={!!form.formState.errors.bio}
            />
            <FieldError>{form.formState.errors.bio?.message}</FieldError>
          </Field>
        </FieldGroup>
      </div>

      <div className="space-y-6 rounded-lg border bg-card p-6">
        <div>
          <div className="flex gap-2 items-center">
            <Globe size={20} />
            <h2 className="text-lg font-semibold">{t("socialLinks.title")}</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{t("socialLinks.description")}</p>
        </div>
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!form.formState.errors.location}>
              <FieldLabel htmlFor="location">{t("socialLinks.fields.location.label")}</FieldLabel>
              <Input
                id="location"
                {...form.register("location")}
                placeholder={t("socialLinks.fields.location.placeholder")}
                aria-invalid={!!form.formState.errors.location}
              />
              <FieldError>{form.formState.errors.location?.message}</FieldError>
            </Field>

            <Field data-invalid={!!form.formState.errors.website}>
              <FieldLabel htmlFor="website">{t("socialLinks.fields.website.label")}</FieldLabel>
              <Input
                id="website"
                type="url"
                {...form.register("website")}
                placeholder={t("socialLinks.fields.website.placeholder")}
                aria-invalid={!!form.formState.errors.website}
              />
              <FieldError>{form.formState.errors.website?.message}</FieldError>
            </Field>

            <Field data-invalid={!!form.formState.errors.github}>
              <FieldLabel htmlFor="github">{t("socialLinks.fields.github.label")}</FieldLabel>
              <Input
                id="github"
                {...form.register("github")}
                placeholder={t("socialLinks.fields.github.placeholder")}
                aria-invalid={!!form.formState.errors.github}
              />
              <FieldError>{form.formState.errors.github?.message}</FieldError>
            </Field>

            <Field data-invalid={!!form.formState.errors.linkedin}>
              <FieldLabel htmlFor="linkedin">{t("socialLinks.fields.linkedin.label")}</FieldLabel>
              <Input
                id="linkedin"
                {...form.register("linkedin")}
                placeholder={t("socialLinks.fields.linkedin.placeholder")}
                aria-invalid={!!form.formState.errors.linkedin}
              />
              <FieldError>{form.formState.errors.linkedin?.message}</FieldError>
            </Field>
          </div>
        </FieldGroup>
      </div>

      <Button type="submit" disabled={isPending} className="w-fit self-end">
        {isPending && <Spinner data-icon="inline-start" />}
        {t("buttons.save")}
      </Button>
    </form>
  );
}
