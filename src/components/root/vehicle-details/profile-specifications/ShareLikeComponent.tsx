'use client';

import React, { useState } from 'react';
import { Share2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareLikeProps {
  className?: string;
  onShare?: () => void;
  onLike?: (isLiked: boolean) => void;
  initialLiked?: boolean; // Allow initial liked state
}

const ShareLikeComponent: React.FC<ShareLikeProps> = ({
  className = '',
  onShare,
  onLike,
  initialLiked = false,
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
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
          console.log('Share cancelled or failed');
        }
      } else {
        // Fallback: Copy to clipboard
        try {
          await navigator.clipboard.writeText(url);
          alert('Link copied to clipboard!');
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
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    onLike?.(newLikedState);

    // Show toast only when liking (not unliking)
    if (newLikedState) {
      setShowToast(true);
      // Auto hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
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
          className="rounded-full p-2 transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <motion.div
            animate={{
              scale: isLiked ? [1, 1.3, 1] : 1,
            }}
            transition={{
              duration: 0.3,
              times: [0, 0.5, 1],
              ease: 'easeInOut',
            }}
          >
            <Heart
              size={28}
              className={`transition-all duration-300 ${
                isLiked
                  ? 'fill-yellow text-yellow'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
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
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="fixed bottom-[12rem] left-[20%] right-[20%] z-50 -translate-x-1/2 transform md:left-1/3 md:right-1/3 lg:bottom-6"
          >
            <div className="flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-white shadow-lg">
              <Heart size={16} className="fill-yellow text-yellow" />
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