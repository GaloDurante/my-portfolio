"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { updateProfile } from "@/lib/actions/profile-actions";
import { applyServerValidationErrors } from "@/lib/utils";
import { profileSchema, type ProfileFormData } from "@/lib/schemas/profile";
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
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

      toast.success("Profile updated successfully");
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <div className="space-y-6 rounded-lg border bg-card p-6">
        <div>
          <div className="flex gap-2 items-center">
            <IdCard size={20} />
            <h2 className="text-lg font-semibold">Personal Information</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Update your personal details and public profile.</p>
        </div>

        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="name">Display Name</FieldLabel>
              <Input id="name" {...form.register("name")} placeholder="Your name" />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>

            <Field data-invalid={!!form.formState.errors.title}>
              <FieldLabel htmlFor="title">Professional Title</FieldLabel>
              <Input id="title" {...form.register("title")} placeholder="e.g. Full Stack Developer" />
              <FieldError>{form.formState.errors.title?.message}</FieldError>
            </Field>

            <Field data-invalid={!!form.formState.errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" {...form.register("email")} placeholder="your.email@example.com" />
              <FieldDescription>This will be used for sign in.</FieldDescription>
              <FieldError>{form.formState.errors.email?.message}</FieldError>
            </Field>
          </div>
        </FieldGroup>
      </div>

      <div className="space-y-6 rounded-lg border bg-card p-6">
        <div>
          <div className="flex gap-2 items-center">
            <BookText size={20} />
            <h2 className="text-lg font-semibold">About & Bio</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Describe who you are, what you do, and the experience you bring.
          </p>
        </div>
        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.shortBio}>
            <FieldLabel htmlFor="shortBio">Short Bio</FieldLabel>
            <Textarea
              id="shortBio"
              {...form.register("shortBio")}
              placeholder="A brief summary about yourself..."
              rows={3}
            />
            <FieldDescription>Shown in project cards and featured sections.</FieldDescription>
            <FieldError>{form.formState.errors.shortBio?.message}</FieldError>
          </Field>

          <Field data-invalid={!!form.formState.errors.bio}>
            <FieldLabel htmlFor="bio">Full Bio</FieldLabel>
            <Textarea id="bio" {...form.register("bio")} placeholder="Tell us more about yourself..." rows={6} />
            <FieldError>{form.formState.errors.bio?.message}</FieldError>
          </Field>
        </FieldGroup>
      </div>

      <div className="space-y-6 rounded-lg border bg-card p-6">
        <div>
          <div className="flex gap-2 items-center">
            <Globe size={20} />
            <h2 className="text-lg font-semibold">Presence & Contact</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Add links and details so people can find you and your work online.
          </p>
        </div>
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field aria-invalid={!!form.formState.errors.location}>
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <Input id="location" {...form.register("location")} placeholder="e.g. Quito, Ecuador" />
              <FieldError>{form.formState.errors.location?.message}</FieldError>
            </Field>

            <Field aria-invalid={!!form.formState.errors.website}>
              <FieldLabel htmlFor="website">Website</FieldLabel>
              <Input id="website" type="url" {...form.register("website")} placeholder="https://yourwebsite.com" />
              <FieldError>{form.formState.errors.website?.message}</FieldError>
            </Field>

            <Field aria-invalid={!!form.formState.errors.github}>
              <FieldLabel htmlFor="github">GitHub</FieldLabel>
              <Input id="github" {...form.register("github")} placeholder="https://github.com/username" />
              <FieldError>{form.formState.errors.github?.message}</FieldError>
            </Field>

            <Field aria-invalid={!!form.formState.errors.linkedin}>
              <FieldLabel htmlFor="linkedin">LinkedIn</FieldLabel>
              <Input id="linkedin" {...form.register("linkedin")} placeholder="https://www.linkedin.com/in/username/" />
              <FieldError>{form.formState.errors.linkedin?.message}</FieldError>
            </Field>
          </div>
        </FieldGroup>
      </div>

      <Button type="submit" disabled={isPending} className="w-fit self-end">
        {isPending && <Spinner data-icon="inline-start" />}
        Save changes
      </Button>
    </form>
  );
}
