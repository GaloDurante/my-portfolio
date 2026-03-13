"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema, type LoginFormData } from "@/lib/schemas/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { toast } from "sonner";
import { LockKeyhole, Mail, ArrowRight } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid credentials", {
          description: "The email or password you entered is incorrect.",
        });
        return;
      }

      toast.success("Welcome back!", {
        description: "Redirecting to dashboard...",
        duration: 2000,
      });

      router.replace(callbackUrl);
    } catch {
      toast.error("Server error", {
        description: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-6 bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-primary/10">
            <LockKeyhole className="size-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">Enter your credentials to access the admin panel</p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    aria-invalid={!!errors.email?.message}
                    {...register("email")}
                  />
                </div>
                {errors.email?.message && <FieldError>{errors.email.message}</FieldError>}
              </Field>
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    aria-invalid={!!errors.password?.message}
                    {...register("password")}
                  />
                </div>
                {errors.password?.message && <FieldError>{errors.password.message}</FieldError>}
              </Field>
            </FieldGroup>

            <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                "Signing in..."
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Restricted access only</p>
          </div>
        </div>
      </div>
    </section>
  );
}
