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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    startAutoSlide();
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const distance = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(distance) > 50) {
      const nextSlide =
        distance > 0
          ? (currentSlide + 1) % bannerImages.length
          : (currentSlide - 1 + bannerImages.length) % bannerImages.length;
      goToSlide(nextSlide);
    }
  };

  // useEffect - only depends on bannerImages.length
  useEffect(() => {
    if (bannerImages.length > 1) {
      startAutoSlide();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bannerImages.length]);

  if (!bannerImages.length) return null;

  return (
    <div className="modern-banner-slider absolute inset-0 w-full overflow-hidden">
      <div className="relative h-full w-full">
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 h-full w-full transition-all duration-500 ease-in-out ${
              index === currentSlide
                ? "translate-x-0 opacity-100"
                : index < currentSlide
                  ? "-translate-x-full opacity-0"
                  : "translate-x-full opacity-0"
            }`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {image?.link ? (
              <a
                href={image.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full w-full"
              >
                <img
                  src={image.src}
                  alt={`Banner ${index + 1}`}
                  className="h-full w-full object-cover object-top"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                />
              </a>
            ) : (
              <img
                src={image.src}
                alt={`Banner ${index + 1}`}
                className="h-full w-full object-cover object-top"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {bannerImages.length > 1 && (
        <>
          <button
            className="absolute left-1 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-yellow transition-colors hover:bg-black/20 focus:outline-none md:left-2"
            onClick={() =>
              goToSlide(
                (currentSlide - 1 + bannerImages.length) % bannerImages.length
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
            className="absolute right-1 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-yellow transition-colors hover:bg-black/20 focus:outline-none md:right-2"
            onClick={() => goToSlide((currentSlide + 1) % bannerImages.length)}
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

      {/* Non-interactive dot indicators */}
      {bannerImages.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-1 md:space-x-2"
          aria-hidden="true"
        >
          {bannerImages.map((_, index) => (
            <span
              key={index}
              className={`block h-2 w-2 rounded-full transition-all duration-200 lg:h-3 lg:w-3 ${
                index === currentSlide ? "scale-125 bg-white" : "bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
