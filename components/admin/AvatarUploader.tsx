"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadAvatar, deleteAvatar } from "@/lib/actions/avatar-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Trash2, User } from "lucide-react";

interface Props {
  value?: string | null;
}

export function AvatarUploader({ value }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadAvatar(formData);
      toast.success("Avatar updated");
      router.refresh();
    } catch {
      toast.error("Upload failed");
    }
  }

  async function handleRemove() {
    try {
      await deleteAvatar();
      toast.success("Avatar removed");
      router.refresh();
    } catch {
      toast.error("Failed to remove avatar");
    }
  }

  return (
    <div className="flex items-center gap-6">
      {value ? (
        <Avatar className="size-24">
          <AvatarImage src={value} />

          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="size-24 rounded-full bg-muted flex items-center justify-center border">
          <User className="text-muted-foreground" />
        </div>
      )}

      <input
        type="file"
        hidden
        ref={inputRef}
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {value ? (
        <Button variant="destructive" onClick={handleRemove}>
          <Trash2 className="size-4 mr-2" />
          Remove
        </Button>
      ) : (
        <Button onClick={() => inputRef.current?.click()}>
          <Upload className="size-4 mr-2" />
          Upload image
        </Button>
      )}
    </div>
  );
}
