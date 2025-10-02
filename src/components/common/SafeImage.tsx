import Image, { ImageProps } from "next/image";
import React from "react";

export interface SafeImageProps extends ImageProps {
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc = "/fallback.webp",
  ...props
}: SafeImageProps) {
  const invalidSrc =
    !src || src === "#" || (typeof src === "string" && src.trim() === "");

  if (invalidSrc) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        width={(props as any).width}
        height={(props as any).height}
        style={{ objectFit: "cover", ...(props as any).style }}
      />
    );
  }

  return <Image src={src} alt={alt} {...props} />;
}
