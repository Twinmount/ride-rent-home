'use client';

import React, { useState } from 'react';
import { Share2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ShareLikeProps {
  className?: string;
  onShare?: () => void;
  onLike?: (isLiked: boolean) => void;
}

const ShareLikeComponent: React.FC<ShareLikeProps> = ({ 
  className = '', 
  onShare, 
  onLike 
}) => {
  const [isLiked, setIsLiked] = useState(false);

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
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Share Button */}
      <motion.button
        onClick={handleShare}
        className=" rounded-full transition-colors duration-200"
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
            className="text-gray-600 hover:text-yellow transition-colors duration-200" 
          />
        </motion.div>
      </motion.button>

      {/* Like Button */}
      <motion.button
        onClick={handleLike}
        className="p-2 rounded-full transition-colors duration-200 "
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isLiked ? "Unlike" : "Like"}
      >
        <motion.div
          animate={{
            scale: isLiked ? [1, 1.3, 1] : 1,
          }}
          transition={{
            duration: 0.3,
            times: [0, 0.5, 1],
            ease: "easeInOut"
          }}
        >
          <Heart 
            size={28} 
            className={`transition-all duration-300 ${
              isLiked 
                ? 'text-yellow fill-yellow ' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default ShareLikeComponent;