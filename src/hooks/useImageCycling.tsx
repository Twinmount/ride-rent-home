import { useState, useRef, useCallback, useEffect } from 'react';

export const useImageCycling = (images: string[], cycleInterval = 1500) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const preloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const preloadedImagesRef = useRef<Set<string>>(new Set());

  const hasMultipleImages = images.length > 1;

  const preloadImages = useCallback(() => {
    if (!hasMultipleImages) return;

    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current);
    }

    preloadTimeoutRef.current = setTimeout(() => {
      images.forEach((src, index) => {
        if (index === 0 || preloadedImagesRef.current.has(src)) return;

        const img = new Image();
        img.onload = () => preloadedImagesRef.current.add(src);
        img.onerror = () => console.warn(`Failed to preload: ${src}`);
        img.src = src;
      });
    }, 100);
  }, [images, hasMultipleImages]);

  const startCycling = useCallback(() => {
    if (!hasMultipleImages) return;

    setIsActive(true);
    preloadImages();

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, cycleInterval);
  }, [hasMultipleImages, images.length, cycleInterval, preloadImages]);

  const stopCycling = useCallback(() => {
    if (!hasMultipleImages) return;

    setIsActive(false);
    setCurrentIndex(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [hasMultipleImages]);

  // Desktop: mouse events
  const handleMouseEnter = useCallback(() => startCycling(), [startCycling]);
  const handleMouseLeave = useCallback(() => stopCycling(), [stopCycling]);

  // Mobile: touch events
  const handleTouchStart = useCallback(() => startCycling(), [startCycling]);
  const handleTouchEnd = useCallback(() => stopCycling(), [stopCycling]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (preloadTimeoutRef.current) clearTimeout(preloadTimeoutRef.current);
    };
  }, []);

  return {
    currentIndex,
    isActive,
    hasMultipleImages,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
  };
};
