'use client';

import { VehicleCardImageSkeleton } from '@/components/skelton/VehicleCardImageSkeleton';
import Image from 'next/image';
import { useState } from 'react';

type VehicleThumbnailProps = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  layoutType: 'grid' | 'carousel';
};

const VehicleThumbnail = ({
  src,
  alt,
  width,
  height,
  layoutType,
}: VehicleThumbnailProps) => {
  const [isImageLoading, setImageLoading] = useState(true);

  // if src is null, render a regular img tag.
  if (!src) {
    return (
      <img
        src={'/assets/img/default-thumbnail.webp'}
        alt={alt}
        width={width}
        height={height}
        className={`h-full w-full rounded object-cover`}
      />
    );
  }

  const className =
    layoutType === 'carousel'
      ? 'h-[9rem] lg:h-[11.25rem]'
      : 'h-[6rem] lg:h-[8rem]';

  return (
    <div className={`relative w-full overflow-hidden rounded ${className}`}>
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
