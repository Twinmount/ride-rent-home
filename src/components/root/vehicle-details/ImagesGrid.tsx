"use client";

import { useEffect, useRef } from "react";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

type MediaItem = {
  source: string;
  type: "image" | "video";
};

type Props = {
  mediaItems: MediaItem[];
  imageAlt?: string;
};

const ImagesGrid = ({ mediaItems, imageAlt }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize Fancybox lightbox for image gallery
  useEffect(() => {
    Fancybox.bind("[data-fancybox='gallery']", { Thumbs: true });
    return () => Fancybox.destroy();
  }, []);

  // Split media items for different layout sections
  const desktopTopGridItems = mediaItems.slice(0, 3); // Desktop: first 3 items in main grid
  const mobileTopGridItem = mediaItems.slice(0, 1); // Mobile: only first item on top
  const desktopBottomItems = mediaItems.slice(3, 7); // Desktop: items 4-7 in bottom row
  const mobileBottomItems = mediaItems.slice(1, 4); // Mobile: items 2-4 in bottom row

  // Calculate overflow count for "+X" indicators
  const desktopRemainingCount = Math.max(0, mediaItems.length - 7);
  const mobileRemainingCount = Math.max(0, mediaItems.length - 4);

  // Render individual media item with optional overlay and scaling
  const renderMedia = (
    item: MediaItem,
    index: number,
    remainingImages?: number,
    isBottomRow?: boolean
  ) => {
    // Handle video items with controls
    if (item.type === 'video') {
      return (
        <a key={index} className="block h-full w-full">
          <video
            ref={videoRef}
            src={item.source}
            muted
            controls
            autoPlay
            loop
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            className="h-full w-full rounded-xl object-cover"
          />
        </a>
      );
    }

    // Handle image items with lightbox integration
    return (
      <a
        key={index}
        data-fancybox="gallery"
        href={item.source}
        className="relative block h-full w-full"
      >
        <img
          src={item.source}
          alt={imageAlt}
          className="h-full w-full rounded-xl object-cover"
          style={{
            transform: isBottomRow ? 'scale(0.98)' : 'scale(0.95)', // Slight zoom for better visibility
            transformOrigin: 'center center',
          }}
        />
        {/* Overlay for remaining images count */}
        {!!remainingImages && remainingImages > 0 && (
          <div
            className="absolute inset-0 flex select-none items-center justify-center bg-black/50 text-2xl font-semibold text-white"
            style={{ borderRadius: '0.75rem' }}
          >
            {`+${remainingImages}`}
          </div>
        )}
      </a>
    );
  };

  // Render bottom thumbnail row (only shows when >3 items)
  const renderBottomRow = () => {
    if (mediaItems.length <= 3) return null;

    return (
      <>
        {/* Desktop: 4 horizontal thumbnails with fixed height */}
        <div
          className="hidden flex-shrink-0 md:block"
          style={{ height: '7.5rem' }}
        >
          <div className="flex h-full gap-2 px-1">
            {desktopBottomItems.map((item, index) => (
              <div key={index} className="h-full flex-1">
                {index === desktopBottomItems.length - 1 &&
                desktopRemainingCount > 0
                  ? renderMedia(item, index + 3, desktopRemainingCount, true)
                  : renderMedia(item, index + 3, undefined, true)}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: 3 rectangular thumbnails with proper aspect ratio */}
        <div
          className="flex justify-center gap-2 px-2 md:hidden"
          style={{ height: '5.625rem' }}
        >
          {mobileBottomItems.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: '30%', height: '100%' }}
            >
              {index === mobileBottomItems.length - 1 &&
              mobileRemainingCount > 0
                ? renderMedia(item, index + 1, mobileRemainingCount, true)
                : renderMedia(item, index + 1, undefined, true)}
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="relative flex h-full w-full flex-col px-2 md:pr-3">
      {/* Main image grid - responsive layout based on item count */}
      <div className="w-full flex-1 overflow-hidden rounded-xl">
        {/* Single item layout */}
        {desktopTopGridItems.length === 1 && (
          <div className="h-full w-full">
            {renderMedia(desktopTopGridItems[0], 0)}
          </div>
        )}

        {/* Two items layout */}
        {desktopTopGridItems.length === 2 && (
          <>
            <div className="hidden h-full gap-2 md:flex">
              {desktopTopGridItems.map((item, i) => (
                <div key={i} className="h-full flex-1">
                  {renderMedia(item, i)}
                </div>
              ))}
            </div>
            <div className="h-full w-full md:hidden">
              {renderMedia(mobileTopGridItem[0], 0)}
            </div>
          </>
        )}

        {/* Three or more items layout - main + stacked grid */}
        {desktopTopGridItems.length >= 3 && (
          <>
            <div className="hidden h-full flex-row gap-2 md:flex">
              <div className="h-full flex-1">
                {renderMedia(desktopTopGridItems[0], 0)}
              </div>
              <div className="flex h-full flex-1 flex-col gap-2">
                {desktopTopGridItems[1] && (
                  <div className="flex-1 overflow-hidden rounded-xl">
                    {renderMedia(desktopTopGridItems[1], 1)}
                  </div>
                )}
                {desktopTopGridItems[2] && (
                  <div className="flex-1 overflow-hidden rounded-xl">
                    {renderMedia(desktopTopGridItems[2], 2)}
                  </div>
                )}
              </div>
            </div>
            <div className="h-full w-full md:hidden">
              {renderMedia(mobileTopGridItem[0], 0)}
            </div>
          </>
        )}
      </div>

      {/* Bottom thumbnail row - appears when >3 items */}
      {mediaItems.length > 3 && <div className="mt-4">{renderBottomRow()}</div>}

      {/* Hidden lightbox anchors for remaining images (8+) */}
      <div className="hidden">
        {mediaItems.slice(7).map((item, i) => (
          <a key={i + 7} data-fancybox="gallery" href={item.source}>
            <img src={item.source} alt={imageAlt} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ImagesGrid;