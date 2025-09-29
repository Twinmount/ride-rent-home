"use client";

import { useState, useEffect } from "react";
import { ImageSrc } from "./Banner";

export default function BannerSlider({
  bannerImages,
}: {
  bannerImages: ImageSrc[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (bannerImages?.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  if (!bannerImages?.length) return null;

  const current = bannerImages[currentSlide];
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
      } else {
        setCurrentSlide(
          (prev) => (prev - 1 + bannerImages.length) % bannerImages.length
        );
      }
    }
  };

  return (
    <div
      className="modern-banner-slider absolute inset-0 w-full overflow-hidden"
      onTouchStart={onTouchStart}
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
            loading="eager"
            fetchPriority="high"
          />
        </a>
      ) : (
        <img
          src={current.src}
          alt={`Banner ${currentSlide + 1}`}
          className="h-full w-full object-cover object-top"
          loading="eager"
          fetchPriority="high"
        />
      )}

      {bannerImages.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-yellow focus:outline-none md:left-4"
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev - 1 + bannerImages.length) % bannerImages.length
              )
            }
            aria-label="Previous slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-yellow focus:outline-none md:right-4"
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
            }
            aria-label="Next slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="rotate-180"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        </>
      )}

      {bannerImages.length > 1 && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 space-x-2 md:flex">
          {" "}
          {bannerImages.map((_, index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? "scale-125 bg-white" : "bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
