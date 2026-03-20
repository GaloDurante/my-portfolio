"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  async function handleRemove() {
    startTransition(async () => {
      try {
        await deleteAvatar();
        toast.success("Avatar removed");
        setOpen(false);
        router.refresh();
      } catch {
        toast.error("Failed to remove avatar");
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="size-4 mr-2" />
          Remove
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="border rounded-full">
            <User className="text-muted-foreground" />
          </AlertDialogMedia>

          <AlertDialogTitle>Remove avatar?</AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete your current profile photo. You can upload a new one at any time.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleRemove();
            }}
            disabled={isPending}
          >
            {isPending && <Spinner data-icon="inline-start" />}
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
