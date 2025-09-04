"use client";

import { useEffect, useState, useCallback, useRef, memo } from 'react';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

type MediaItem = {
  source: string;
  type: 'image' | 'video';
  thumbnail?: string; // Add support for smaller thumbnails
  width?: number;
  height?: number;
};

type Props = {
  mediaItems: MediaItem[];
  imageAlt?: string;
  className?: string;
};

// Memoized skeleton component
const ImageSkeleton = memo(({ className = '' }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gray-200 ${className}`}
    role="presentation"
    aria-hidden="true"
  >
    <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
  </div>
));
ImageSkeleton.displayName = 'ImageSkeleton';

// Optimized image component with native lazy loading
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
    const [error, setError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleLoad = useCallback(() => {
      setIsLoaded(true);
      onLoad?.();
    }, [onLoad]);

    const handleError = useCallback(() => {
      setError(true);
      setIsLoaded(true);
    }, []);

    // Use srcset for responsive images if thumbnail provided
    const srcSet = thumbnail ? `${thumbnail} 400w, ${src} 800w` : undefined;

    if (error) {
      return (
        <div
          className={`${className} flex items-center justify-center bg-gray-200 text-gray-500`}
        >
          <span className="text-sm">Failed to load</span>
        </div>
      );
    }

    return (
      <>
        {!isLoaded && <ImageSkeleton className="absolute inset-0 rounded-xl" />}
        <img
          ref={imgRef}
          src={thumbnail || src}
          srcSet={srcSet}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
        />
        {overlayCount !== undefined && overlayCount > 0 && isLoaded && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/60 text-xl font-semibold text-white backdrop-blur-sm md:text-2xl"
            aria-label={`${overlayCount} more images`}
          >
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

    useEffect(() => {
      // Prevent multiple initializations
      if (fancyboxInitialized.current) return;

      // Small delay to ensure DOM is ready
      const timer = requestAnimationFrame(() => {
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
          Images: {
            zoom: true,
          },
          Hash: false, // Disable URL hash for better performance
        });
        fancyboxInitialized.current = true;
      });

      return () => {
        cancelAnimationFrame(timer);
        if (fancyboxInitialized.current) {
          Fancybox.destroy();
          fancyboxInitialized.current = false;
        }
      };
    }, []);

    const handleImageLoad = useCallback((index: number) => {
      setLoadedImages((prev) => {
        const next = new Set(prev);
        next.add(index);
        return next;
      });
    }, []);

    // Organize media items for display
    const videoItem = mediaItems.find((item) => item.type === 'video');
    const imageItems = mediaItems.filter((item) => item.type === 'image');

    const mainItem = videoItem || mediaItems[0];
    const sideItems = videoItem
      ? imageItems.slice(0, 2)
      : mediaItems.slice(1, 3);
    const thumbnailItems = videoItem
      ? imageItems.slice(2)
      : mediaItems.slice(3);

    const remainingCount = Math.max(0, thumbnailItems.length - 4);
    const visibleThumbnails = thumbnailItems.slice(0, 4);

    const renderMediaItem = useCallback(
      (
        item: MediaItem,
        index: number,
        overlayCount?: number,
        priority = false
      ) => {
        const isVideo = item.type === 'video';
        const baseClasses = 'h-full w-full rounded-xl object-cover';

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
                autoPlay
                loop
                controlsList="nodownload"
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
              className={`${baseClasses} transition-transform duration-300 will-change-transform group-hover:scale-105`}
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
      <div className={`${className}`} role="region" aria-label="Image gallery">
        {/* Desktop Layout */}
        <div className="hidden h-full lg:flex lg:flex-col lg:gap-3">
          {/* Main Grid Area */}
          <div className="flex flex-1 gap-3">
            {/* Main Image/Video */}
            <div className="flex-[2] overflow-hidden rounded-xl">
              {renderMediaItem(mainItem, 0, undefined, true)}
            </div>

            {/* Side Column */}
            <div className="flex flex-1 flex-col gap-3">
              {sideItems.map((item, index) => (
                <div
                  key={`side-${index}`}
                  className="flex-1 overflow-hidden rounded-xl"
                >
                  {renderMediaItem(item, index + 1, undefined, true)}
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnail Row - Now properly aligned */}
          {visibleThumbnails.length > 0 && (
            <div className="flex h-20 gap-3 xl:h-24">
              {visibleThumbnails.map((item, index) => (
                <div
                  key={`thumb-${index}`}
                  className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl xl:h-24 xl:w-[24%]"
                >
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

        {/* Medium Layout */}
        <div className="hidden h-full flex-col gap-3 md:flex lg:hidden">
          <div className="h-64 w-full overflow-hidden rounded-xl sm:h-80">
            {renderMediaItem(mainItem, 0, undefined, true)}
          </div>

          {sideItems.length > 0 && (
            <div className="flex h-32 gap-3">
              {sideItems.map((item, index) => (
                <div
                  key={`md-side-${index}`}
                  className="flex-1 overflow-hidden rounded-xl"
                >
                  {renderMediaItem(item, index + 1)}
                </div>
              ))}
            </div>
          )}

          {visibleThumbnails.length > 0 && (
            <div className="flex h-20 gap-2">
              {visibleThumbnails.slice(0, 3).map((item, index) => (
                <div
                  key={`md-thumb-${index}`}
                  className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl"
                >
                  {renderMediaItem(
                    item,
                    index + (videoItem ? 3 : 4),
                    index === 2 && remainingCount > 0
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
                  className="h-full flex-1 overflow-hidden rounded-xl"
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

        {/* Hidden lightbox items for SEO and accessibility */}
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
                  width={item.width}
                  height={item.height}
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