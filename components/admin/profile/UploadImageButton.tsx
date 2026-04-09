"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";

import { uploadAvatar } from "@/lib/actions/avatar-actions";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

import { toast } from "sonner";
import { Upload, User } from "lucide-react";

const MAX_SIZE = 2 * 1024 * 1024;

export function UploadImageButton() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function validateFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Please upload an image.");
      return false;
    }

    if (file.size > MAX_SIZE) {
      toast.error("Image must be smaller than 2MB.");
      return false;
    }

    return true;
  }

  function handleSelect(file: File) {
    if (!validateFile(file)) return;

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const objectUrl = URL.createObjectURL(file);

    setFile(file);
    setPreview(objectUrl);
  }

  function resetState() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleUpload() {
    if (!file) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        await uploadAvatar(formData);
        toast.success("Avatar updated");

        setOpen(false);
        resetState();

        router.refresh();
      } catch (error) {
        toast.error("Upload failed");
        console.error(error);
      }
    });
  }

  return (
    <>
      <input
        type="file"
        hidden
        ref={inputRef}
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleSelect(f);
        }}
      />

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) resetState();
          setOpen(next);
        }}
      >
        <DialogTrigger asChild>
          <Button>
            <Upload data-icon="inline-start" className="size-4" />
            Upload image
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Upload avatar</DialogTitle>
            <DialogDescription>Choose a profile picture. Supported formats: JPG, PNG. Max size: 2MB.</DialogDescription>

            <div className="flex flex-col items-center gap-4 my-2">
              {preview ? (
                <>
                  <Avatar className="size-28">
                    <AvatarImage src={preview} />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>

                  <Button variant="ghost" disabled={isPending} onClick={() => inputRef.current?.click()}>
                    Change image
                  </Button>
                </>
              ) : (
                <div
                  className="size-28 rounded-full border flex items-center justify-center cursor-pointer text-muted-foreground hover:bg-muted transition-colors"
                  onClick={() => inputRef.current?.click()}
                >
                  <Upload />
                </div>
              )}
            </div>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>

            <Button disabled={!file || isPending} onClick={handleUpload}>
              {isPending && <Spinner data-icon="inline-start" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
