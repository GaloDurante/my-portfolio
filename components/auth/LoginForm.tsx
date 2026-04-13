"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { createLoginSchema, type LoginFormData } from "@/lib/schemas/login";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { LockKeyhole, Mail, ArrowRight } from "lucide-react";

export function LoginForm() {
  const t = useTranslations("auth.login.form");
  const router = useRouter();
  const searchParams = useSearchParams();
  const schema = createLoginSchema(t);
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(t("submit.error.INVALID_CREDENTIALS.title"), {
          description: t("submit.error.INVALID_CREDENTIALS.message"),
        });
        return;
      }

      toast.success(t("submit.success.title"), {
        description: t("submit.success.message"),
        duration: 2000,
      });

      router.replace(callbackUrl);
    } catch {
      toast.error(t("submit.error.UNKNOWN_ERROR.title"), {
        description: t("submit.error.UNKNOWN_ERROR.message"),
      });
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FieldGroup>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">{t("fields.email.label")}</FieldLabel>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                placeholder={t("fields.email.placeholder")}
                className="pl-10"
                aria-invalid={!!errors.email?.message}
                {...register("email")}
              />
            </div>
            <FieldError>{errors.email?.message}</FieldError>
          </Field>
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">{t("fields.password.label")}</FieldLabel>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder={t("fields.password.placeholder")}
                className="pl-10"
                aria-invalid={!!errors.password?.message}
                {...register("password")}
              />
            </div>
            <FieldError>{errors.password?.message}</FieldError>
          </Field>
        </FieldGroup>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Spinner data-icon="inline-start" />}
          <>
            {t("button.label")}
            <ArrowRight data-icon="inline-end" />
          </>
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>{t("extra")}</p>
      </div>
    </div>
  );
}
