'use client';

import { VehicleCardImageSkeleton } from '@/components/skelton/VehicleCardImageSkeleton';
import Image from 'next/image';
import { useState } from 'react';
import { useImageCycling } from '@/hooks/useImageCycling';

type VehicleThumbnailProps = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  layoutType: 'grid' | 'carousel';
  vehiclePhotos?: string[];
};

const VehicleThumbnail = ({
  src,
  alt,
  width,
  height,
  layoutType,
  vehiclePhotos = [],
}: VehicleThumbnailProps) => {
  const [isImageLoading, setImageLoading] = useState(true);

  const allImages = [src, ...vehiclePhotos].filter(
    (img, index, arr) => img && img.trim() !== '' && arr.indexOf(img) === index
  ) as string[];

  const {
    currentIndex,
    isActive,
    hasMultipleImages,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
  } = useImageCycling(allImages, 1000);

  const defaultImage = '/assets/img/default-thumbnail.webp';
  const currentImageSrc = allImages[currentIndex] || defaultImage;

  if (!src) {
    return (
      <img
        src={defaultImage}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full rounded object-cover"
      />
    );
  }

  const containerClassName = `
    relative w-full overflow-hidden rounded 
    ${layoutType === 'carousel' ? 'h-[8rem] lg:h-[8.3rem]' : 'h-[6rem] lg:h-[7.5rem]'}
    ${hasMultipleImages ? 'cursor-pointer select-none' : ''}
  `;

  return (
    <div
      className={containerClassName}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {isImageLoading && <VehicleCardImageSkeleton />}

      <Image
        src={currentImageSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setImageLoading(false)}
        className={`h-full w-full rounded object-cover transition-all duration-500 ease-in-out ${isActive && hasMultipleImages ? 'scale-[1.02]' : 'scale-100'} `}
        quality={70}
        priority={currentIndex === 0}
      />
    </div>
  );
};

export default VehicleThumbnail;