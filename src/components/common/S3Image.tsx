// components/common/S3Image.tsx

import Image from "next/image";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetSignedUrlQuery } from "@/store/api/uploadApi";

type Props = {
  imageKey?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback: React.ReactNode;
};

export function S3Image({
  imageKey,
  alt,
  width,
  height,
  className,
  fallback,
}: Props) {
  const { data, isLoading } = useGetSignedUrlQuery(imageKey ?? skipToken);

  if (!imageKey || isLoading || !data?.signedUrl) {
    return <>{fallback}</>;
  }

  return (
    <Image
      src={data.signedUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
