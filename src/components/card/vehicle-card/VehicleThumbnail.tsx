"use client";

import { VehicleCardImageSkeleton } from "@/components/skelton/VehicleCardImageSkeleton";
import SafeImage from "@/components/common/SafeImage";

import { useState } from "react";
import { useImageCycling } from "@/hooks/useImageCycling";
import { Images } from "lucide-react";

type VehicleThumbnailProps = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  layoutType: "grid" | "carousel";
  vehiclePhotos?: string[];
  priority?: boolean;
  quality?: number;
  loading?: "lazy" | "eager";
  isOptimizedThumbnail?: boolean;
};

const VehicleThumbnail = ({
  src,
  alt,
  width,
  height,
  layoutType,
  vehiclePhotos = [],
  priority = false,
  loading = "lazy",
  quality = 90,
  isOptimizedThumbnail,
}: VehicleThumbnailProps) => {
  const [isImageLoading, setImageLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const allImages = [src, ...vehiclePhotos].filter(
    (img, index, arr) => img && img.trim() !== "" && arr.indexOf(img) === index
  ) as string[];

  const {
    currentIndex,
    isActive,
    hasMultipleImages,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
  } = useImageCycling(allImages, 1500);

  const defaultImage = "/assets/img/default-thumbnail.webp";
  const currentImageSrc = allImages[currentIndex] || defaultImage;

  // Enhanced event handlers with loading states
  const handleEnhancedMouseEnter = () => {
    if (hasMultipleImages) {
      setIsTransitioning(true);
    }
    handleMouseEnter();
  };

  const handleEnhancedMouseLeave = () => {
    setIsTransitioning(false);
    handleMouseLeave();
  };

  const handleEnhancedTouchStart = () => {
    if (hasMultipleImages) {
      setIsTransitioning(true);
    }
    handleTouchStart();
  };

  const handleEnhancedTouchEnd = () => {
    setIsTransitioning(false);
    handleTouchEnd();
  };

  const containerClassName = `
  relative w-full overflow-hidden rounded 
  ${layoutType === "carousel" ? "h-[8rem] lg:h-[8.3rem]" : "h-[16rem] sm:h-[10.2rem] md:h-[6.8rem] lg:h-[7.5rem]"}
  ${hasMultipleImages ? "cursor-pointer select-none" : ""}
`;

  const imageSizes = isOptimizedThumbnail
    ? // For optimized thumbnails: Use exact size (no responsive variants needed)
      layoutType === "carousel"
      ? "15rem"
      : "15rem"
    : // For fallback images: Use responsive sizes
      layoutType === "carousel"
      ? "8.3rem"
      : "8.3rem";
  return (
    <div
      className={containerClassName}
      onMouseEnter={handleEnhancedMouseEnter}
      onMouseLeave={handleEnhancedMouseLeave}
      onTouchStart={handleEnhancedTouchStart}
      onTouchEnd={handleEnhancedTouchEnd}
    >
      {isImageLoading && <VehicleCardImageSkeleton />}

      <SafeImage
        src={currentImageSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setImageLoading(false)}
        className={`h-full w-full rounded object-cover transition-all duration-500 ease-in-out ${
          isActive && hasMultipleImages ? "scale-[1.02]" : "scale-100"
        } `}
        quality={quality}
        priority={priority}
        loading={loading}
        sizes={imageSizes}
        onError={() => setImageLoading(false)}
      />

      {/* Cycling Loading Indicator - Top Right */}
      {hasMultipleImages && isTransitioning && (
        <div className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-sm">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {/* Progress Bar (Alternative option) */}
      {hasMultipleImages && isActive && allImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform space-x-1">
          {allImages.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-6 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white shadow-sm" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* Gallery Icon - More Images Indicator */}
      {hasMultipleImages && allImages.length > 1 && !isTransitioning && (
        <div className="absolute right-2 top-2 rounded-full bg-black/40 p-1.5 backdrop-blur-sm">
          <Images className="h-3 w-3 text-white" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};

export default VehicleThumbnail;
