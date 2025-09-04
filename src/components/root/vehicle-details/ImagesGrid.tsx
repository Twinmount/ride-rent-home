"use client";

import { useEffect, useState, useCallback, useRef, memo, useMemo } from 'react';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

type MediaItem = {
  source: string;
  type: 'image' | 'video';
  thumbnail?: string;
  width?: number;
  height?: number;
};

type Props = {
  mediaItems: MediaItem[];
  imageAlt?: string;
  className?: string;
};

const ImageSkeleton = memo(({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 ${className}`} />
));
ImageSkeleton.displayName = 'ImageSkeleton';

const LazyImage = memo(
  ({
    src,
    alt,
    className = '',
    priority = false,
    onLoad,
    overlayCount,
    thumbnail,
    width,
    height,
  }: {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
    onLoad?: () => void;
    overlayCount?: number;
    thumbnail?: string;
    width?: number;
    height?: number;
  }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleLoad = useCallback(() => {
      setIsLoaded(true);
      onLoad?.();
    }, [onLoad]);

    const handleError = useCallback(() => {
      setHasError(true);
      setIsLoaded(true);
    }, []);

    if (hasError) {
      return (
        <div
          className={`${className} flex items-center justify-center bg-gray-100 text-gray-500`}
        >
          <span className="text-sm">Image unavailable</span>
        </div>
      );
    }

    return (
      <>
        {!isLoaded && <ImageSkeleton className="absolute inset-0 rounded-xl" />}
        <img
          src={thumbnail || src}
          srcSet={thumbnail ? `${thumbnail} 400w, ${src} 800w` : undefined}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
        />
        {overlayCount !== undefined && overlayCount > 0 && isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60 text-xl font-semibold text-white backdrop-blur-sm">
            +{overlayCount}
          </div>
        )}
      </>
    );
  }
);
LazyImage.displayName = 'LazyImage';

const ImagesGrid = memo(
  ({ mediaItems, imageAlt = 'Gallery image', className = '' }: Props) => {
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
    const fancyboxInitialized = useRef(false);

    // Organize media items
    const {
      mainItem,
      sideItems,
      thumbnailItems,
      remainingCount,
      visibleThumbnails,
    } = useMemo(() => {
      const videoItem = mediaItems.find((item) => item.type === 'video');
      const imageItems = mediaItems.filter((item) => item.type === 'image');

      const main = videoItem || mediaItems[0];
      const side = videoItem ? imageItems.slice(0, 2) : mediaItems.slice(1, 3);
      const thumbnails = videoItem ? imageItems.slice(2) : mediaItems.slice(3);
      const remaining = Math.max(0, thumbnails.length - 4);
      const visible = thumbnails.slice(0, 4);

      return {
        mainItem: main,
        sideItems: side,
        thumbnailItems: thumbnails,
        remainingCount: remaining,
        visibleThumbnails: visible,
      };
    }, [mediaItems]);

    // Initialize Fancybox
    useEffect(() => {
      if (fancyboxInitialized.current || !mediaItems.length) return;

      const timer = setTimeout(() => {
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
              ],
              right: ['slideshow', 'thumbs', 'close'],
            },
          },
          Images: { zoom: true },
          Hash: false,
        });
        fancyboxInitialized.current = true;
      }, 100);

      return () => {
        clearTimeout(timer);
        if (fancyboxInitialized.current) {
          Fancybox.destroy();
          fancyboxInitialized.current = false;
        }
      };
    }, [mediaItems.length]);

    const handleImageLoad = useCallback((index: number) => {
      setLoadedImages((prev) => {
        if (prev.has(index)) return prev;
        return new Set([...prev, index]);
      });
    }, []);

    const renderMediaItem = useCallback(
      (
        item: MediaItem,
        index: number,
        overlayCount?: number,
        priority = false
      ) => {
        const baseClasses = 'h-full w-full rounded-xl object-cover';
        const isVideo = item.type === 'video';

        if (isVideo) {
          return (
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-black">
              {!loadedImages.has(index) && (
                <ImageSkeleton className="absolute inset-0 rounded-xl" />
              )}
              <video
                src={item.source}
                className={`${baseClasses} ${loadedImages.has(index) ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                controls
                muted
                playsInline
                onLoadedData={() => handleImageLoad(index)}
                poster={item.thumbnail}
                preload="metadata"
              >
                <track kind="captions" />
              </video>
            </div>
          );
        }

        return (
          <a
            href={item.source}
            data-fancybox="gallery"
            className="group relative block h-full w-full overflow-hidden rounded-xl"
            aria-label={`${imageAlt} ${index + 1}`}
          >
            <LazyImage
              src={item.source}
              alt={`${imageAlt} ${index + 1}`}
              className={`${baseClasses} transition-transform duration-300 group-hover:scale-105`}
              priority={priority}
              onLoad={() => handleImageLoad(index)}
              overlayCount={overlayCount}
              thumbnail={item.thumbnail}
              width={item.width}
              height={item.height}
            />
          </a>
        );
      },
      [loadedImages, handleImageLoad, imageAlt]
    );

    return (
      <div
        className={`${className} w-full`}
        role="region"
        aria-label="Image gallery"
      >
        {/* Desktop & Medium Layout */}
        <div className="hidden h-full md:flex md:flex-col md:gap-3">
          {/* Main Grid Area */}
          <div className="flex flex-1 gap-3">
            {/* Main Image/Video */}
            <div className="min-h-0 flex-[2] overflow-hidden rounded-xl">
              {renderMediaItem(mainItem, 0, undefined, true)}
            </div>

            {/* Side Column */}
            {sideItems.length > 0 && (
              <div className="flex min-h-0 flex-1 flex-col gap-3">
                {sideItems.map((item, index) => (
                  <div
                    key={`side-${index}`}
                    className="min-h-0 flex-1 overflow-hidden rounded-xl"
                  >
                    {renderMediaItem(item, index + 1, undefined, true)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail Row - Only on desktop */}
          {visibleThumbnails.length > 0 && (
            <div className="hidden h-20 gap-3 lg:flex xl:h-24">
              {visibleThumbnails.map((item, index) => (
                <div
                  key={`thumb-${index}`}
                  className="h-full min-w-0 flex-1 overflow-hidden rounded-xl"
                >
                  {renderMediaItem(
                    item,
                    index + 3,
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
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
            {renderMediaItem(mediaItems[0], 0, undefined, true)}
          </div>

          {mediaItems.length > 1 && (
            <div className="flex h-20 gap-2">
              {mediaItems.slice(1, 4).map((item, index) => (
                <div
                  key={`mobile-${index}`}
                  className="h-full min-w-0 flex-1 overflow-hidden rounded-xl"
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
          <div className="sr-only" aria-hidden="true">
            {thumbnailItems.slice(4).map((item, index) => (
              <a
                key={`hidden-${index}`}
                href={item.source}
                data-fancybox="gallery"
                tabIndex={-1}
              >
                <img
                  src={item.thumbnail || item.source}
                  alt={`${imageAlt} ${index + 5}`}
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ImagesGrid.displayName = 'ImagesGrid';

export default ImagesGrid;