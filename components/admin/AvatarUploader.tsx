"use client";

import { useRef, useState, useTransition } from "react";
import { uploadAvatar, deleteAvatar } from "@/lib/actions/avatar-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Trash2, Loader2 } from "lucide-react";

interface Props {
  value?: string | null;
}

export function AvatarUploader({ value }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const [preview, setPreview] = useState<string | null>(value ?? null);

  function handleFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      try {
        const result = await uploadAvatar(formData);
        setPreview(result.url);
        toast.success("Avatar updated");
      } catch {
        toast.error("Upload failed");
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      try {
        await deleteAvatar();
        setPreview(null);
        toast.success("Avatar removed");
      } catch {
        toast.error("Failed to remove avatar");
      }
    });
  }

  return (
    <div className="flex items-center gap-6">
      <Avatar className="size-24">
        {preview ? <AvatarImage src={preview} /> : <AvatarFallback>U</AvatarFallback>}
      </Avatar>

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

      <Button onClick={() => inputRef.current?.click()} disabled={isPending}>
        {isPending ? (
          <Loader2 className="animate-spin size-4" />
        ) : (
          <>
            <Upload className="size-4 mr-2" />
            Upload
          </>
        )}
      </Button>

      {preview && (
        <Button variant="destructive" onClick={handleRemove} disabled={isPending}>
          <Trash2 className="size-4 mr-2" />
          Remove
        </Button>
      )}
    </div>
  );
}
