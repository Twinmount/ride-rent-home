"use client";

import { useEffect, useRef } from "react";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

type MediaItem = {
  source: string;
  type: "video" | "image";
};

type ImagesProps = {
  mediaItems: MediaItem[];
  imageAlt?: string;
};

function ImagesGrid({ mediaItems = [], imageAlt }: ImagesProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    Fancybox.bind("[data-fancybox='gallery']", {
      Thumbs: true,
    });
  }, []);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="relative mx-auto max-w-screen-2xl rounded-xl bg-white p-4 shadow-sm lg:py-4">
      <div className="flex flex-col gap-2 overflow-hidden rounded-xl md:flex-row">
        {/* Left main preview */}
        <div className="flex flex-1 flex-col overflow-hidden rounded">
          {mediaItems[0]?.type === "video" ? (
            <a
              data-fancybox="gallery"
              href={mediaItems[0].source}
              className="block h-full w-full"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <video
                ref={videoRef}
                src={mediaItems[0].source}
                muted
                controls
                className="h-full w-full rounded object-cover"
              />
            </a>
          ) : (
            <a
              data-fancybox="gallery"
              href={mediaItems[0].source}
              className="block h-full w-full"
            >
              <img
                src={mediaItems[0].source}
                alt={imageAlt}
                className="h-full w-full rounded object-cover"
              />
            </a>
          )}
        </div>

        {/* Right 2x2 grid */}
        <div className="flex flex-1">
          <div className="grid w-full grid-cols-2 gap-2">
            {mediaItems.slice(1, 5).map((item, index) => (
              <div key={index} className="relative overflow-hidden rounded">
                <a data-fancybox="gallery" href={item.source}>
                  <img
                    src={item.source}
                    alt={imageAlt}
                    className="h-full w-full object-cover"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImagesGrid;