"use client";

import { VehicleCardImageSkeleton } from "@/components/skelton/VehicleCardImageSkeleton";
import Image from "next/image";
import { useState } from "react";
import { vehicleBadgesConfig } from "./vehicle-badge/vehicleBadgesConfig";
import { VehicleBadge } from "./vehicle-badge/VehicleBadge";

type VehicleThumbnailProps = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
};

const VehicleThumbnail = ({
  src,
  alt,
  width,
  height,
}: VehicleThumbnailProps) => {
  const [isImageLoading, setImageLoading] = useState(true);

  // if src is null, render a regular img tag.
  if (!src) {
    return (
      <img
        src={"/assets/img/default-thumbnail.webp"}
        alt={alt}
        width={width}
        height={height}
        className={`h-full w-full rounded object-cover`}
      />
    );
  }

  return (
    <div className="relative h-[9rem] w-full overflow-hidden rounded lg:h-[11.25rem]">
      {/* Show skeleton only when image is loading */}
      {isImageLoading && <VehicleCardImageSkeleton />}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setImageLoading(false)}
        className={`h-full w-full rounded object-cover`}
        quality={70}
      />
    </div>
  );
};

export default VehicleThumbnail;
