"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { S3Image } from "./S3Image";

type ImageUploaderLayout = "avatar" | "logo" | "banner";

type ImageUploaderProps = {
  layout?: ImageUploaderLayout;
  onFileSelect?: (file: File | null) => void;
  initialImage?: string;
  maxSizeMB?: number;
  className?: string;
  disabled?: boolean;
};

export function ImageUploader({
  layout = "avatar",
  onFileSelect,
  initialImage,
  maxSizeMB = 5,
  className,
  disabled = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  function openPicker() {
    if (disabled) return;
    inputRef.current?.click();
  }

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

  function handleRemove(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setPreview(null);
    setError("");
    onFileSelect?.(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  if (layout === "banner") {
    return (
      <div className={cn("space-y-1", className)}>
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          className={cn(
            "relative flex h-44 w-full overflow-hidden rounded-none bg-(--color-navy)",
            "transition-all active:scale-[0.99] disabled:opacity-60",
          )}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Banner preview"
              fill
              className="object-cover"
            />
          ) : initialImage ? (
            <S3Image
              imageKey={initialImage}
              width={1200}
              height={400}
              alt="Banner Preview"
              fallback={
                <>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1B3FA0_0%,#0D1B3E_75%)]" />
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(135deg,transparent_0%,white_50%,transparent_100%)]" />

                  <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-white">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-(--color-brand) shadow-lg">
                      <ImagePlus size={26} />
                    </div>

                    <p className="font-(family-name:--font-display) text-base font-black uppercase tracking-[0.08em]">
                      Add Banner
                    </p>

                    <p className="mt-1 text-xs font-medium text-white/75">
                      JPG or PNG, max {maxSizeMB}MB
                    </p>
                  </div>
                </>
              }
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1B3FA0_0%,#0D1B3E_75%)]" />
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(135deg,transparent_0%,white_50%,transparent_100%)]" />

              <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-white">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-(--color-brand) shadow-lg">
                  <ImagePlus size={26} />
                </div>

                <p className="font-(family-name:--font-display) text-base font-black uppercase tracking-[0.08em]">
                  Add Banner
                </p>

                <p className="mt-1 text-xs font-medium text-white/75">
                  JPG or PNG, max {maxSizeMB}MB
                </p>
              </div>
            </>
          )}

          {preview && (
            <>
              <div className="absolute inset-0 bg-black/0 transition-colors hover:bg-black/20" />

              <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-(--color-brand) text-white shadow-lg">
                <Camera size={18} />
              </div>

              <button
                type="button"
                onClick={handleRemove}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white"
              >
                <X size={16} />
              </button>
            </>
          )}
        </button>

        {error && <p className="px-4 text-xs text-(--color-live)">{error}</p>}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );
  }

  const isLogo = layout === "logo";

  return (
    <div className={cn("space-y-1", className)}>
      <button
        type="button"
        onClick={openPicker}
        disabled={disabled}
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-full bg-white",
          "border-2 border-dashed border-(--color-text-muted)/40",
          "transition-all active:scale-95 disabled:opacity-60",
          isLogo ? "h-24 w-24 shadow-xl ring-4 ring-white" : "h-36 w-36",
          preview && "border-(--color-brand)",
        )}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Image preview"
            fill
            className="object-cover"
          />
        ) : initialImage ? (
          <S3Image
            imageKey={initialImage}
            alt="Image Preview"
            width={144}
            height={144}
            fallback={
              <div
                className={cn(
                  "flex items-center justify-center rounded-full bg-(--color-brand) text-white",
                  isLogo ? "h-14 w-14" : "h-16 w-16",
                )}
              >
                <Camera size={isLogo ? 22 : 26} />
              </div>
            }
          />
        ) : (
          <div
            className={cn(
              "flex items-center justify-center rounded-full bg-(--color-brand) text-white",
              isLogo ? "h-14 w-14" : "h-16 w-16",
            )}
          >
            <Camera size={isLogo ? 22 : 26} />
          </div>
        )}

        {preview && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity hover:opacity-100">
            <Camera size={24} className="text-white" />
          </div>
        )}

        {isLogo && (
          <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-(--color-brand) text-white shadow-md ring-2 ring-white">
            <Camera size={14} />
          </span>
        )}
      </button>

      {error && <p className="text-xs text-(--color-live)">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
