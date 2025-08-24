'use client';

import { VehicleCardImageSkeleton } from '@/components/skelton/VehicleCardImageSkeleton';
import Image from 'next/image';
import { useState } from 'react';

type VehicleThumbnailProps = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

const VehicleThumbnail = ({
  src,
  alt,
  width,
  height,
  className,
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
        className={className}
      />
    );
  }

  return (
    <div className="image-box">
      {/* Show skeleton only when image is loading */}
      {isImageLoading && <VehicleCardImageSkeleton />}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setImageLoading(false)}
        className={className}
        quality={70}
      />
    </div>
  );
};

export default VehicleThumbnail;
