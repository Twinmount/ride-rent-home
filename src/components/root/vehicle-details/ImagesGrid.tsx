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

  const handleMouseEnter = () => videoRef.current?.play();
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const gridItems = mediaItems.slice(0, 4);
  const lightboxImages = mediaItems.filter((item) => item.type === "image" && !gridItems.includes(item));

  const totalImageCount = mediaItems.filter(
    (item) => item.type === "image",
  ).length;
  const displayedImageCount = mediaItems
    .slice(0, 4)
    .filter((item) => item.type === "image").length;
  const remainingImages = totalImageCount - displayedImageCount;

  const renderMedia = (item: MediaItem, index: number) => {
    if (item.type === "video") {
      return (
        <a
          key={index}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="block h-full w-full"
        >
          <video
            ref={videoRef}
            src={item.source}
            muted
            controls
            // to hide options
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            className="h-full w-full rounded object-cover"
          />
        </a>
      );
    }

    return (
      <a
        key={index}
        data-fancybox="gallery"
        href={item.source}
        className="block h-full w-full"
      >
        <img
          src={item.source}
          alt={imageAlt}
          className="h-full w-full rounded object-cover"
        />
      </a>
    );
  };

  return (
    <div className="relative w-full rounded-xl bg-white p-4 shadow-md">
      <div
        className="w-full overflow-hidden rounded md:h-[400px]"
        // style={{ height: "400px" }}
      >
        {/* === One media === */}
        {gridItems.length === 1 && (
          <div className="h-full w-full">{renderMedia(gridItems[0], 0)}</div>
        )}

        {/* === Two media items === */}
        {gridItems.length === 2 && (
          <div className="flex h-full gap-2">
            {gridItems.map((item, i) => (
              <div key={i} className="h-full w-1/2">
                {renderMedia(item, i)}
              </div>
            ))}
          </div>
        )}

        {/* === Three media items === */}
        {gridItems.length === 3 && (
          <div className="flex h-full flex-col gap-2 md:flex-row">
            {/* Column 1: First item full height */}
            <div className="flex-1">{renderMedia(gridItems[0], 0)}</div>

            {/* Column 2: two stacked items (1 or 2 items) */}
            <div className="flex flex-1 flex-row gap-2 md:flex-col">
              {gridItems[1] && (
                <div className="flex-1 md:h-1/2">
                  {renderMedia(gridItems[1], 1)}
                </div>
              )}
              {gridItems[2] && (
                <div className="flex-1 md:h-1/2">
                  {renderMedia(gridItems[2], 2)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* === Three or four media items === */}
        {gridItems.length >= 4 && (
          <div className="flex h-full flex-col gap-2 md:flex-row">
            {/* Column 1: First item full height */}
            <div className="flex-1">{renderMedia(gridItems[0], 0)}</div>

            {/* Column 2: two stacked items (1 or 2 items) */}
            <div className="flex flex-1 flex-row gap-2 md:flex-col">
              {gridItems[1] && (
                <div className="flex-1 md:h-1/2">
                  {renderMedia(gridItems[1], 1)}
                </div>
              )}
              {gridItems[2] && (
                <div className="flex-1 md:h-1/2">
                  {renderMedia(gridItems[2], 2)}
                </div>
              )}
            </div>

            {/* Column 3: fourth item full height */}
            {gridItems[3] && (
              <div className="relative flex-1">
                {renderMedia(gridItems[3], 3)}
                {remainingImages > 0 && (
                  <div className="absolute inset-0 flex select-none items-center justify-center rounded bg-black/50 text-2xl font-semibold text-white">
                    {`+${remainingImages}`}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden Lightbox Anchors for all images */}
      <div className="hidden">
        {lightboxImages.map((item, i) => (
          <a key={i} data-fancybox="gallery" href={item.source}>
            <img src={item.source} alt={imageAlt} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ImagesGrid;