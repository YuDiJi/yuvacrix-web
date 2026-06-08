"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { cn } from "@/lib/cn";

type ImageUploaderProps = {
  onFileSelect?: (file: File | null) => void;
  initialImage?: string;
  uploadText?: string;
  changeText?: string;
  maxSizeMB?: number;
};

export function ImageUploader({
  onFileSelect,
  initialImage,
  uploadText = "Upload Photo",
  changeText = "Change Photo",
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(initialImage ?? null);
  const [error, setError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be under ${maxSizeMB}MB`);
      return;
    }

    setError("");
    onFileSelect?.(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full",
            "border-[3px] border-dashed transition-all duration-200 active:scale-95",
            preview
              ? "border-(--color-brand)"
              : "border-(--color-text-muted)/40 hover:border-(--color-brand)/60",
          )}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              width={144}
              height={144}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                background: "linear-gradient(135deg, #1b3fa0 0%, #4b8bff 100%)",
              }}
            >
              <Camera size={24} className="text-white" />
            </div>
          )}

          {preview && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
              <Camera size={28} className="text-white" />
            </div>
          )}
        </button>

        {preview && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "absolute bottom-1 right-1",
              "flex h-9 w-9 items-center justify-center rounded-full",
              "bg-(--color-brand) text-white",
            )}
          >
            <Camera size={16} />
          </button>
        )}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="font-(family-name:--font-display) text-sm font-black uppercase tracking-[0.08em] text-(--color-brand)"
        >
          {preview ? changeText : uploadText}
        </button>

        <p className="mt-1 text-xs text-(--color-text-muted)">
          JPG or PNG, max {maxSizeMB}MB
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
}
