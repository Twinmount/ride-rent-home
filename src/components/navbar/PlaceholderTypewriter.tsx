"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const PlaceholderTypewriter = () => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const textArray = [
    "BMW S Series",
    "Audi A4",
    "Tesla Model 3",
    "Mercedes C Class",
  ];
  const typingSpeed = 100; // Typing speed
  const deletingSpeed = 50; // Deleting speed
  const pauseTime = 1500; // Pause before deleting

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;

    const currentText = textArray[currentIndex]; // Get the current text once

    if (!isDeleting) {
      // Typing logic
      if (displayedText.length < currentText.length) {
        typingTimeout = setTimeout(() => {
          setDisplayedText(currentText.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        // Pause before deleting starts
        typingTimeout = setTimeout(() => setIsDeleting(true), pauseTime);
      }
    } else {
      // Deleting logic
      if (displayedText.length > 0) {
        typingTimeout = setTimeout(() => {
          setDisplayedText(currentText.slice(0, displayedText.length - 1));
        }, deletingSpeed);
      } else {
        // Move to next text and reset deleting state
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % textArray.length);
      }
    }

    return () => clearTimeout(typingTimeout); // Cleanup timeout on unmount or re-render
  }, [displayedText, isDeleting, currentIndex, textArray]);

  return (
    <motion.span
      className=" relative flex h-12 w-full items-center border-none pl-6 pr-20 text-xs text-slate-600 focus:ring-0 sm:pl-10 sm:text-base md:pl-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key={currentIndex}
    >
      {displayedText || "\u00A0"}
    </motion.span>
  );
};
