"use client";

import { useEffect } from 'react';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

type MediaItem = {
  source: string;
  type: 'image' | 'video';
};

type Props = {
  mediaItems: MediaItem[];
  imageAlt?: string;
  className?: string;
};

const ImagesGrid = ({ mediaItems, imageAlt, className = '' }: Props) => {
  useEffect(() => {
    Fancybox.bind("[data-fancybox='gallery']", {
      Thumbs: true,
      Toolbar: {
        display: {
          left: ['infobar'],
          middle: [
            'zoomIn',
            'zoomOut',
            'toggle1to1',
            'rotateCCW',
            'rotateCW',
            'flipX',
            'flipY',
          ],
          right: ['slideshow', 'thumbs', 'close'],
        },
      },
    });
    return () => Fancybox.destroy();
  }, []);

  // Organize media items for display
  const videoItem = mediaItems.find((item) => item.type === 'video');
  const imageItems = mediaItems.filter((item) => item.type === 'image');

  const mainItem = videoItem || mediaItems[0];
  const sideItems = videoItem ? imageItems.slice(0, 2) : mediaItems.slice(1, 3);
  const thumbnailItems = videoItem ? imageItems.slice(2) : mediaItems.slice(3);

  const remainingCount = Math.max(0, thumbnailItems.length - 4);
  const visibleThumbnails = thumbnailItems.slice(0, 4);

  const renderMediaItem = (
    item: MediaItem,
    index: number,
    overlayCount?: number
  ) => {
    const isVideo = item.type === 'video';
    const baseClasses = 'h-full w-full rounded-xl object-cover';

    if (isVideo) {
      return (
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-black">
          <video
            src={item.source}
            className={baseClasses}
            controls
            muted
            autoPlay
            loop
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            playsInline
          />
        </div>
      );
    }

    return (
      <a
        href={item.source}
        data-fancybox="gallery"
        className="group relative block h-full w-full overflow-hidden rounded-xl"
      >
        <img
          src={item.source}
          alt={imageAlt || `Gallery image ${index + 1}`}
          className={`${baseClasses} transition-transform duration-300 group-hover:scale-105`}
          loading="lazy"
        />
        {overlayCount && overlayCount > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xl font-semibold text-white backdrop-blur-sm md:text-2xl">
            +{overlayCount}
          </div>
        )}
      </a>
    );
  };

  return (
    <div className={`h-full w-full ${className}`}>
      {/* Desktop Layout - Adapts to container height with no internal padding */}
      <div className="hidden h-full md:grid md:grid-rows-[1fr_auto] md:gap-3">
        {/* Main Grid Area - Takes most of available height */}
        <div className="grid h-full min-h-0 grid-cols-3 gap-3">
          {/* Main Image/Video - Takes 2 columns, maintains aspect but fits container */}
          <div className="col-span-2 overflow-hidden rounded-xl">
            <div className="h-full w-full">{renderMediaItem(mainItem, 0)}</div>
          </div>

          {/* Side Column - Takes 1 column, divided into 2 equal rows */}
          <div className="grid grid-rows-2 gap-3">
            {sideItems.map((item, index) => (
              <div key={index} className="overflow-hidden rounded-xl">
                {renderMediaItem(item, index + 1)}
              </div>
            ))}
          </div>
        </div>

        {/* Thumbnail Row - Fixed height based on content */}
        {visibleThumbnails.length > 0 && (
          <div className="grid h-20 grid-cols-4 gap-3 lg:h-24">
            {visibleThumbnails.map((item, index) => (
              <div key={index} className="overflow-hidden rounded-xl">
                {renderMediaItem(
                  item,
                  index + (videoItem ? 3 : 4),
                  index === visibleThumbnails.length - 1
                    ? remainingCount
                    : undefined
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Layout - Preserved as requested */}
      <div className="flex h-full w-full flex-col px-2 md:hidden">
        <div className="w-full flex-1 overflow-hidden rounded-xl">
          {renderMediaItem(mediaItems[0], 0)}
        </div>

        {mediaItems.length > 1 && (
          <div className="mt-4 flex h-20 justify-center gap-2 px-2">
            {mediaItems.slice(1, 4).map((item, index) => (
              <div
                key={index}
                className="h-full w-[30%] flex-shrink-0 overflow-hidden rounded-xl"
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

      {/* Hidden lightbox items for remaining images */}
      {remainingCount > 0 && (
        <div className="hidden">
          {thumbnailItems.slice(4).map((item, index) => (
            <a key={index} href={item.source} data-fancybox="gallery">
              <img src={item.source} alt={imageAlt} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImagesGrid;