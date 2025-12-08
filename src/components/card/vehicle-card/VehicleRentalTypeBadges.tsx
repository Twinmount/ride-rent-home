"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type VehicleRentalTypeBadgesProps = {
  isSelfDriveAvailable?: boolean;
  isDriverAvailable?: boolean;
};

const VehicleRentalTypeBadges = ({
  isSelfDriveAvailable,
  isDriverAvailable,
}: VehicleRentalTypeBadgesProps) => {
  if (!isSelfDriveAvailable && !isDriverAvailable) return null;

  return (
    <motion.div 
      className="flex items-center gap-1.5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {isSelfDriveAvailable && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.1,
            type: "spring", 
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ 
            scale: 1.05, 
            y: -2,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "group relative inline-flex items-center gap-1 overflow-hidden cursor-pointer",
            // Compact padding
            "rounded-md px-2 py-1",
            "text-[10px] font-semibold tracking-wide",
            "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600",
            "text-white flex-shrink-0",
            "shadow-[0_2px_8px_-2px_rgba(251,146,60,0.3)]",
            "ring-1 ring-white/20 ring-inset"
          )}
        >
          {/* Animated shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 0.5
            }}
          />
          
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-md bg-gradient-to-b from-white/15 to-transparent" />
          
          {/* Icon with rotation animation */}
          <motion.svg
            className="relative z-10 h-3 w-3 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.9" />
            <path
              d="M9 12l2 2 4-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
          
          {/* Compact Text */}
          <span className="relative z-10 leading-none whitespace-nowrap">
            Self Drive
          </span>
        </motion.div>
      )}

      {isDriverAvailable && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.2,
            type: "spring", 
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ 
            scale: 1.05, 
            y: -2,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "group relative inline-flex items-center gap-1 overflow-hidden cursor-pointer",
            // Compact padding
            "rounded-md px-2 py-1",
            "text-[10px] font-semibold tracking-wide",
            "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600",
            "text-white flex-shrink-0",
            "shadow-[0_2px_8px_-2px_rgba(59,130,246,0.3)]",
            "ring-1 ring-white/20 ring-inset"
          )}
        >
          {/* Animated shimmer with delay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 0.5,
              delay: 1
            }}
          />
          
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-md bg-gradient-to-b from-white/15 to-transparent" />
          
          {/* Icon with bounce animation */}
          <motion.svg
            className="relative z-10 h-3 w-3 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            whileHover={{ 
              scale: [1, 1.2, 1],
              transition: { duration: 0.3 }
            }}
          >
            <circle cx="12" cy="7" r="4" fill="currentColor" />
            <path
              d="M12 12c-4 0-8 2-8 5v2h16v-2c0-3-4-5-8-5z"
              fill="currentColor"
            />
          </motion.svg>
          
          {/* Compact Text */}
          <span className="relative z-10 leading-none whitespace-nowrap">
            With Driver
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VehicleRentalTypeBadges;
