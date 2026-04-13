"use client";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";

import { signOutAction } from "@/lib/actions/auth";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

export function SignOutButton({ collapsed = false }: { collapsed?: boolean }) {
  const t = useTranslations("admin.sidebar.signOut");
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    startTransition(async () => {
      await signOutAction();
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className={cn("w-full justify-start gap-2", collapsed && "justify-center")}>
          <LogOut data-icon="inline-start" />
          {!collapsed && t("label")}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("modal.title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("modal.description")}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{t("modal.button.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleSignOut();
            }}
            disabled={isPending}
          >
            {isPending && <Spinner data-icon="inline-start" />}
            {t("modal.button.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
