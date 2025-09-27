"use client";

import { useState, useEffect, useRef } from "react";
import { ImageSrc } from "./Banner";

export default function BannerSlider({
  bannerImages,
}: {
  bannerImages: ImageSrc[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerImages?.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  if (!bannerImages?.length) return null;

  const current = bannerImages[currentSlide];

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    } else if (isRightSwipe) {
      setCurrentSlide(
        (prev) => (prev - 1 + bannerImages.length) % bannerImages.length
      );
    }
  };

  return (
    <div
      className="modern-banner-slider absolute inset-0 w-full min-w-full"
      ref={sliderRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {current?.link ? (
        <a
          href={current.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full w-full"
        >
          <img
            src={current.src}
            alt={`Banner ${currentSlide + 1}`}
            className="h-full w-full object-cover object-top"
            fetchPriority="high"
            loading="eager"
          />
        </a>
      ) : (
        <img
          src={current.src}
          alt={`Banner ${currentSlide + 1}`}
          className="h-full w-full object-cover object-top"
          fetchPriority="high"
          loading="eager"
        />
      )}

      {/* Arrows - visible on all devices */}
      {bannerImages.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-yellow focus:outline-none"
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev - 1 + bannerImages.length) % bannerImages.length
              )
            }
            aria-label="Previous slide"
            type="button"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-all duration-100 hover:scale-125"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-yellow focus:outline-none"
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
            }
            aria-label="Next slide"
            type="button"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="rotate-180 transition-all duration-100 hover:scale-125"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
