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
};

const ImagesGrid = ({ mediaItems, imageAlt }: Props) => {
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

  // Since we always have 6-7 items (6 images + 1 video or 7 images)
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
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-2xl font-semibold text-white backdrop-blur-sm">
            +{overlayCount}
          </div>
        )}
      </a>
    );
  };

  return (
    <div className="h-full w-full">
      {/* Desktop Layout */}
      <div
        className="hidden h-full flex-col md:flex"
        style={{ height: '40.63rem' }}
      >
        {/* Main Grid - Calculate exact height: total height minus thumbnail height and gap */}
        <div className="w-full" style={{ height: 'calc(100% - 9rem)' }}>
          <div className="flex h-full gap-3 p-2">
            {/* Main Image/Video - 2/3 width, full height */}
            <div className="w-2/3 overflow-hidden rounded-xl">
              {renderMediaItem(mainItem, 0)}
            </div>

            {/* Side Column - 1/3 width, two stacked items */}
            <div className="flex w-1/3 flex-col gap-3">
              {sideItems.map((item, index) => (
                <div key={index} className="flex-1 overflow-hidden rounded-xl">
                  {renderMediaItem(item, index + 1)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex h-32 gap-3 px-2 pt-3">
          {visibleThumbnails.map((item, index) => (
            <div key={index} className="flex-1 overflow-hidden rounded-xl">
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
      </div>

      {/* Mobile Layout  */}
      <div className="flex h-full w-full flex-col px-2 md:hidden">
        <div className="w-full flex-1 overflow-hidden rounded-xl">
          {renderMediaItem(mediaItems[0], 0)}
        </div>

        {mediaItems.length > 1 && (
          <div
            className="mt-4 flex justify-center gap-2 px-2"
            style={{ height: '5.625rem' }}
          >
            {mediaItems.slice(1, 4).map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 overflow-hidden rounded-xl"
                style={{ width: '30%', height: '100%' }}
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