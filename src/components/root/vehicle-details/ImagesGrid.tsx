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

  useEffect(() => {
    Fancybox.bind("[data-fancybox='gallery']", {
      Thumbs: true,
      // Carousel: {
      // infinite loop enable/disable
      //   infinite: false,
      // },
    });
    return () => Fancybox.destroy();
  }, []);

  // Desktop: Top grid items (first 3), Mobile: Top grid item (first 1)
  const desktopTopGridItems = mediaItems.slice(0, 3);
  const mobileTopGridItem = mediaItems.slice(0, 1);

  // Bottom row items
  const desktopBottomItems = mediaItems.slice(3, 7); // items 4-7 (4 items)
  const mobileBottomItems = mediaItems.slice(1, 4); // items 2-4 (3 items)

  // Calculate remaining images count
  const desktopRemainingCount = Math.max(0, mediaItems.length - 7);
  const mobileRemainingCount = Math.max(0, mediaItems.length - 4);

  const renderMedia = (
    item: MediaItem,
    index: number,
    remainingImages?: number,
    isBottomRow?: boolean
  ) => {
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
        />
        {!!remainingImages && remainingImages > 0 && (
          <div className="absolute inset-0 flex select-none items-center justify-center rounded-lg bg-black/50 text-2xl font-semibold text-white">
            {`+${remainingImages}`}
          </div>
        )}
      </a>
    );
  };

  const renderBottomRow = () => {
    if (mediaItems.length <= 3) return null; // No bottom row if 3 or fewer total images

    return (
      <div className="mt-4">
        {/* Desktop view: 4 items (images 4-7) */}
        <div className="hidden gap-2 md:flex">
          {desktopBottomItems.map((item, index) => (
            <div key={index} className="h-28 flex-1">
              {index === desktopBottomItems.length - 1 &&
              desktopRemainingCount > 0
                ? renderMedia(item, index + 3, desktopRemainingCount, true)
                : renderMedia(item, index + 3, undefined, true)}
            </div>
          ))}
        </div>

        {/* Mobile view: 3 items (images 2-4) */}
        <div className="flex justify-center gap-2 md:hidden">
          {mobileBottomItems.map((item, index) => (
            <div key={index} className="h-20 w-1/3 flex-shrink-0">
              {index === mobileBottomItems.length - 1 &&
              mobileRemainingCount > 0
                ? renderMedia(item, index + 1, mobileRemainingCount, true)
                : renderMedia(item, index + 1, undefined, true)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full p-4">
      {/* Top Grid */}
      <div className="w-full overflow-hidden rounded-xl md:h-[400px]">
        {/* === One media === */}
        {/* Desktop: Show first image, Mobile: Show first image */}
        {desktopTopGridItems.length === 1 && (
          <div className="h-full w-full">
            {renderMedia(desktopTopGridItems[0], 0)}
          </div>
        )}

        {/* === Two media items === */}
        {/* Desktop: Show both images, Mobile: Show only first image */}
        {desktopTopGridItems.length === 2 && (
          <>
            {/* Desktop view */}
            <div className="hidden h-full md:flex">
              {desktopTopGridItems.map((item, i) => (
                <div key={i} className="h-full w-1/2">
                  {renderMedia(item, i)}
                </div>
              ))}
            </div>
            {/* Mobile view */}
            <div className="h-full w-full md:hidden">
              {renderMedia(mobileTopGridItem[0], 0)}
            </div>
          </>
        )}

        {/* === Three or more media items === */}
        {/* Desktop: Show 3 images in grid, Mobile: Show only first image */}
        {desktopTopGridItems.length >= 3 && (
          <>
            {/* Desktop view */}
            <div className="hidden h-full flex-row gap-2 md:flex">
              {/* Column 1: First item full height */}
              <div className="flex-1">
                {renderMedia(desktopTopGridItems[0], 0)}
              </div>

              {/* Column 2: two stacked items */}
              <div className="m-2 flex flex-1 flex-col">
                {desktopTopGridItems[1] && (
                  <div className="h-1/2">
                    {renderMedia(desktopTopGridItems[1], 1)}
                  </div>
                )}
                {desktopTopGridItems[2] && (
                  <div className="h-1/2 pt-2">
                    {renderMedia(desktopTopGridItems[2], 2)}
                  </div>
                )}
              </div>
            </div>
            {/* Mobile view */}
            <div className="h-full w-full md:hidden">
              {renderMedia(mobileTopGridItem[0], 0)}
            </div>
          </>
        )}
      </div>

      {/* Bottom Row */}
      {renderBottomRow()}

      {/* Hidden Lightbox Anchors for remaining images */}
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