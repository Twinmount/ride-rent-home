"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to track the visibility of a DOM element using IntersectionObserver.
 *
 * @param {string} selector - The CSS selector of the element to observe.
 * @param {number} [threshold=0.1] - The threshold at which to trigger visibility changes.
 * @returns {boolean} - A boolean indicating whether the element is visible or not.
 */

const useElementVisibility = (selector: string, threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const element = document.querySelector(selector);
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { root: null, threshold },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [selector, threshold]);

  return isVisible;
};

export default useElementVisibility;
