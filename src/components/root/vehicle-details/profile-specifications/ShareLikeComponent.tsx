"use client";

import React, { useState } from "react";
import { Share2, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSavedVehicle } from "@/hooks/useSavedVehicle";

interface ShareLikeProps {
  className?: string;
  vehicleId?: string;
  onShare?: () => void;
  onLike?: (isLiked: boolean) => void;
  initialLiked?: boolean; // Allow initial liked state
}

const ShareLikeComponent: React.FC<ShareLikeProps> = ({
  className = "",
  vehicleId,
  onShare,
  onLike,
  initialLiked = false,
}) => {
  const [showToast, setShowToast] = useState(false);

  // Use saved vehicle hook if vehicleId is provided, otherwise fall back to local state
  const savedVehicleHook = vehicleId
    ? useSavedVehicle({
        vehicleId,
        onSaveSuccess: (isSaved) => {
          onLike?.(isSaved);
          if (isSaved) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          }
        },
        onSaveError: (error) => {
          console.error("Error saving/unsaving vehicle:", error);
          // Show appropriate error message
          if (error.message.includes("login")) {
            // Handle unauthenticated user - could show login modal
            alert("Please login to save vehicles");
          } else {
            // Other errors
            alert("Something went wrong. Please try again.");
          }
        },
      })
    : null;

  // Use hook state if available, otherwise use local state
  const [localIsLiked, setLocalIsLiked] = useState(initialLiked);
  const isLiked = savedVehicleHook ? savedVehicleHook.isSaved : localIsLiked;
  const isLoading = savedVehicleHook?.isLoading || false;

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      const title = document.title;

      // Check if Web Share API is supported
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            url: url,
          });
        } catch (error) {
          console.log("Share cancelled or failed");
        }
      } else {
        // Fallback: Copy to clipboard
        try {
          await navigator.clipboard.writeText(url);
          alert("Link copied to clipboard!");
        } catch (error) {
          // Final fallback: Show URL in alert
          alert(`Share this link: ${url}`);
        }
      }
    }

    // Call custom onShare callback if provided
    onShare?.();
  };

  const handleLike = () => {
    if (savedVehicleHook) {
      // Use the hook's toggle function
      savedVehicleHook.toggleSaved();
    } else {
      // Fall back to local state management
      const newLikedState = !localIsLiked;
      setLocalIsLiked(newLikedState);
      onLike?.(newLikedState);

      // Show toast only when liking (not unliking)
      if (newLikedState) {
        setShowToast(true);
        // Auto hide toast after 3 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    }
  };

  return (
    <>
      <div className={`flex items-center gap-4 ${className}`}>
        {/* Share Button */}
        <motion.button
          onClick={handleShare}
          className="rounded-full p-2 transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Share"
        >
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ duration: 0.2 }}
          >
            <Share2
              size={24}
              className="hover:text-yellow-500 text-gray-600 transition-colors duration-200"
            />
          </motion.div>
        </motion.button>

        {/* Like Button */}
        <motion.button
          onClick={handleLike}
          disabled={isLoading}
          className={`rounded-full p-2 transition-colors duration-200 ${
            isLoading ? "cursor-not-allowed opacity-70" : ""
          }`}
          whileHover={{ scale: isLoading ? 1 : 1.1 }}
          whileTap={{ scale: isLoading ? 1 : 0.95 }}
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <motion.div
            animate={{
              scale: isLiked ? [1, 1.3, 1] : 1,
              rotate: isLoading ? 360 : 0,
            }}
            transition={{
              duration: isLoading ? 1 : 0.3,
              times: isLoading ? undefined : [0, 0.5, 1],
              ease: "easeInOut",
              repeat: isLoading ? Infinity : 0,
              repeatType: isLoading ? "loop" : undefined,
            }}
          >
            <Heart
              size={28}
              className={`transition-all duration-300 ${
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 hover:text-red-400"
              } ${isLoading ? "animate-pulse" : ""}`}
            />
          </motion.div>
        </motion.button>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed bottom-[12rem] left-[20%] right-[20%] z-50 -translate-x-1/2 transform md:left-1/3 md:right-1/3 lg:bottom-6"
          >
            <div className="flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-white shadow-lg">
              <Heart size={16} className="fill-red-500 text-red-500" />
              <span className="block text-sm font-medium lg:hidden">
                Added to your favorites!
              </span>
              <span className="hidden text-sm font-medium lg:block">
                Added to your favorites, you will be notified of offers and
                updates.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareLikeComponent;
