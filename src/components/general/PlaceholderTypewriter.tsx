"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getTypewriterStrings } from "@/helpers";

const TYPING_SPEED = 100; // Base typing speed (ms)
const DELETING_SPEED = 50; // Base deleting speed (ms)
const PAUSE_TIME = 1500; // Pause before deleting (ms)

const MOTION_PROPS = {
  className:
    "relative mt-1 flex h-12 w-full items-center border-none pl-12 pr-20 text-slate-600 focus:ring-0 sm:text-base lg:pl-14",
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Randomize speed between 70%–100% of base to mimic human typing
const randomSpeed = (base: number) => Math.random() * base * 0.3 + base * 0.7;

export const PlaceholderTypewriter = ({
  category,
  country,
}: {
  category: string;
  country: string;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const shouldShowTypewriter = country === "ae";

  // Memoized text array based on category
  const TEXT_ARRAY = useMemo(() => getTypewriterStrings(category), [category]);

  const currentText = TEXT_ARRAY[currentIndex];

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    setIsDeleting(false);
  }, [category]);

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing logic
      if (displayedText.length < currentText.length) {
        const nextText = currentText.slice(0, displayedText.length + 1);
        if (nextText !== displayedText) {
          typingTimeout = setTimeout(
            () => setDisplayedText(nextText),
            randomSpeed(TYPING_SPEED)
          );
        }
      } else {
        // Pause before deleting starts
        typingTimeout = setTimeout(() => setIsDeleting(true), PAUSE_TIME);
      }
    } else {
      // Deleting logic
      if (displayedText.length > 0) {
        const nextText = currentText.slice(0, displayedText.length - 1);
        if (nextText !== displayedText) {
          typingTimeout = setTimeout(
            () => setDisplayedText(nextText),
            randomSpeed(DELETING_SPEED)
          );
        }
      } else {
        // Move to next text and reset deleting state
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % TEXT_ARRAY.length);
      }
    }

    return () => clearTimeout(typingTimeout); // Cleanup on unmount/re-render
  }, [displayedText, isDeleting, currentIndex, currentText]);

  if (!shouldShowTypewriter) {
    return (
      <motion.span
        {...MOTION_PROPS}
        className="line-clamp-1 w-fit max-w-full text-sm"
      >
        Search
      </motion.span>
    );
  }

  return (
    <motion.span
      {...MOTION_PROPS}
      key={currentIndex}
      className="line-clamp-1 w-fit max-w-full text-sm"
    >
      {displayedText || "\u00A0"}
    </motion.span>
  );
};
