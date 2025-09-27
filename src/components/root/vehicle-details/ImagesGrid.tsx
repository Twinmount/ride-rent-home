"use client";

import { useEffect, useRef, memo, useMemo, useState, useCallback } from "react";
import SafeImage from "@/components/common/SafeImage";

import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

type MediaItem = {
  source: string;
  type: "image" | "video";
  thumbnail?: string;
  width?: number;
  height?: number;
};

type Props = {
  mediaItems: MediaItem[];
  imageAlt?: string;
  className?: string;
};

const ImageSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-gray-200 ${className}`} />
);

const ImagesGrid = ({
  mediaItems,
  imageAlt = "Gallery image",
  className = "",
}: Props) => {
  const fancyboxInitialized = useRef(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  }, []);

  // Organize media items
  const { mainItem, sideItems, visibleThumbnails, remainingCount } =
    useMemo(() => {
      if (!mediaItems.length) {
        return {
          mainItem: null,
          sideItems: [],
          visibleThumbnails: [],
          remainingCount: 0,
        };
      }

      const main = mediaItems[0];
      const side = mediaItems.slice(1, 3);
      const thumbnails = mediaItems.slice(3, 7);
      const remaining = Math.max(0, mediaItems.length - 7);

      return {
        mainItem: main,
        sideItems: side,
        visibleThumbnails: thumbnails,
        remainingCount: remaining,
      };
    }, [mediaItems]);

  // Initialize Fancybox
  useEffect(() => {
    if (!mediaItems.length || fancyboxInitialized.current) return;

    try {
      Fancybox.bind("[data-fancybox='gallery']", {
        Thumbs: true,
        Toolbar: {
          display: {
            left: ["infobar"],
            middle: [
              "zoomIn",
              "zoomOut",
              "toggle1to1",
              "rotateCCW",
              "rotateCW",
            ],
            right: ["slideshow", "thumbs", "close"],
          },
        },
        Images: { zoom: true },
        Hash: false,
      });
      fancyboxInitialized.current = true;
    } catch (error) {
      console.error("Fancybox initialization error:", error);
    }

    return () => {
      try {
        if (fancyboxInitialized.current) {
          Fancybox.destroy();
          fancyboxInitialized.current = false;
        }
      } catch (error) {
        console.error("Fancybox cleanup error:", error);
      }
    };
  }, [mediaItems.length]);

  const renderMediaItem = (
    item: MediaItem,
    index: number,
    overlayCount?: number,
    priority = false
  ) => {
    if (item.type === "video") {
      return (
        <div className="relative h-full w-full">
          {!loadedImages.has(index) && (
            <ImageSkeleton className="absolute inset-0 z-10" />
          )}
          <video
            src={item.source}
            className="h-full w-full rounded-xl object-cover"
            autoPlay
            loop
            muted
            playsInline
            controls
            poster={item.thumbnail}
            preload="metadata"
            onLoadedData={() => handleImageLoad(index)}
            onError={() => {
              console.error("Video failed to load:", item.source);
              handleImageLoad(index);
            }}
          />
          {overlayCount && overlayCount > 0 && loadedImages.has(index) && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-black/60 text-xl font-semibold text-white">
              +{overlayCount}
            </div>
          )}
        </div>
      );
    }

    return (
      <a
        href={item.source}
        data-fancybox="gallery"
        className="group relative block h-full w-full overflow-hidden rounded-xl"
      >
        {!loadedImages.has(index) && (
          <ImageSkeleton className="absolute inset-0 z-10" />
        )}
        <SafeImage
          src={item.thumbnail || item.source}
          alt={`${imageAlt} ${index + 1}`}
          fill
          className={`object-cover transition-all duration-300 group-hover:scale-105 ${
            loadedImages.has(index) ? "opacity-100" : "opacity-0"
          }`}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={priority ? 85 : 75}
          onLoad={() => handleImageLoad(index)}
          onError={(e) => {
            console.error("Image failed to load:", item.source);
            const target = e.currentTarget;
            if (item.thumbnail && target.src !== item.source) {
              target.src = item.source;
            } else {
              handleImageLoad(index);
            }
          }}
        />
        {overlayCount && overlayCount > 0 && loadedImages.has(index) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-black/60 text-xl font-semibold text-white">
            +{overlayCount}
          </div>
        )}
      </a>
    );
  };

  if (!mainItem) return null;

  return (
    <div className={`${className} w-full`}>
      {/* Desktop Layout */}
      <div className="hidden h-full md:flex md:flex-col md:gap-3">
        <div className="flex flex-1 gap-3">
          {/* Main Image */}
          <div className="relative flex-[2] overflow-hidden rounded-xl">
            {renderMediaItem(mainItem, 0, undefined, true)}
          </div>

          {/* Side Images */}
          {sideItems.length > 0 && (
            <div className="flex flex-1 flex-col gap-3">
              {sideItems.map((item, index) => (
                <div
                  key={`side-${index}`}
                  className="relative flex-1 overflow-hidden rounded-xl"
                >
                  {renderMediaItem(item, index + 1, undefined, index === 0)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Row */}
        {visibleThumbnails.length > 0 && (
          <div className="hidden h-20 gap-3 lg:flex xl:h-24">
            {visibleThumbnails.map((item, index) => (
              <div
                key={`thumb-${index}`}
                className="relative aspect-square flex-1 overflow-hidden rounded-xl"
              >
                {renderMediaItem(
                  item,
                  index + 1 + sideItems.length,
                  index === visibleThumbnails.length - 1
                    ? remainingCount
                    : undefined
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="flex h-full flex-col gap-3 md:hidden">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          {renderMediaItem(mediaItems[0], 0, undefined, true)}
        </div>

        {mediaItems.length > 1 && (
          <div className="flex h-20 gap-2">
            {mediaItems.slice(1, 4).map((item, index) => (
              <div
                key={`mobile-${index}`}
                className="relative aspect-square flex-1 overflow-hidden rounded-xl"
              >
                {renderMediaItem(
                  item,
                  index + 1,
                  index === 2 && mediaItems.length > 4
                    ? mediaItems.length - 4
                    : undefined
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden lightbox items */}
      {remainingCount > 0 && (
        <div className="sr-only">
          {mediaItems.slice(7).map((item, index) => (
            <a
              key={`hidden-${index}`}
              href={item.source}
              data-fancybox="gallery"
              tabIndex={-1}
            >
              <SafeImage
                src={item.thumbnail || item.source}
                alt={`${imageAlt} ${index + 8}`}
                width={200}
                height={150}
                className="object-cover"
                quality={60}
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

ImagesGrid.displayName = "ImagesGrid";

export default ImagesGrid;
