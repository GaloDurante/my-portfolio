"use client";
import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import { deleteAvatar } from "@/lib/actions/avatar-actions";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Trash2, User } from "lucide-react";

export function RemoveImageButton() {
  const t = useTranslations("admin.profile.avatar");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  async function handleRemove() {
    startTransition(async () => {
      try {
        await deleteAvatar();
        toast.success(t("modal.delete.submit.success"));
        setOpen(false);
        router.refresh();
      } catch {
        toast.error(t("modal.delete.submit.error"));
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="size-4" data-icon="inline-start" />
          {t("button.destructive")}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="border rounded-full">
            <User className="text-muted-foreground" />
          </AlertDialogMedia>

          <AlertDialogTitle>{t("modal.delete.title")}</AlertDialogTitle>

          <AlertDialogDescription>{t("modal.delete.description")}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{t("modal.delete.button.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleRemove();
            }}
            disabled={isPending}
          >
            {isPending && <Spinner data-icon="inline-start" />}
            {t("modal.delete.button.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
