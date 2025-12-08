"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { memo } from "react";

type VehicleRentalTypeBadgesProps = {
  isSelfDriveAvailable?: boolean;
  isDriverAvailable?: boolean;
};

// Optimized: Use CSS keyframes instead of Framer Motion for shimmer
const shimmerStyles = `
  @keyframes badge-shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const VehicleRentalTypeBadges = memo(
  ({
    isSelfDriveAvailable,
    isDriverAvailable,
  }: VehicleRentalTypeBadgesProps) => {
    if (!isSelfDriveAvailable && !isDriverAvailable) return null;

    return (
      <>
        <style>{shimmerStyles}</style>
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
                damping: 15,
              }}
              whileHover={{
                scale: 1.05,
                y: -2,
              }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "group relative inline-flex cursor-pointer items-center gap-1 overflow-hidden",
                "rounded-md px-2 py-1",
                "text-[10px] font-semibold tracking-wide",
                "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600",
                "flex-shrink-0 text-white",
                "shadow-[0_2px_8px_-2px_rgba(251,146,60,0.3)]",
                "ring-1 ring-inset ring-white/20",
                "transition-shadow duration-200"
              )}
            >
              {/* Optimized: CSS animation instead of Framer Motion */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{
                  animation: "badge-shimmer 2.5s linear infinite",
                  animationDelay: "0s",
                }}
              />

              {/* Inner glow - static, no animation needed */}
              <div className="pointer-events-none absolute inset-0 rounded-md bg-gradient-to-b from-white/15 to-transparent" />

              {/* Optimized: Simple SVG without motion wrapper */}
              <svg
                className="relative z-10 h-3 w-3 flex-shrink-0 transition-transform duration-500 ease-in-out group-hover:rotate-[360deg]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="currentColor"
                  opacity="0.9"
                />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="relative z-10 whitespace-nowrap leading-none">
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
                damping: 15,
              }}
              whileHover={{
                scale: 1.05,
                y: -2,
              }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "group relative inline-flex cursor-pointer items-center gap-1 overflow-hidden",
                "rounded-md px-2 py-1",
                "text-[10px] font-semibold tracking-wide",
                "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600",
                "flex-shrink-0 text-white",
                "shadow-[0_2px_8px_-2px_rgba(59,130,246,0.3)]",
                "ring-1 ring-inset ring-white/20",
                "transition-shadow duration-200"
              )}
            >
              {/* Optimized: CSS animation with delay */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{
                  animation: "badge-shimmer 2.5s linear infinite",
                  animationDelay: "1s",
                }}
              />

              {/* Inner glow - static */}
              <div className="pointer-events-none absolute inset-0 rounded-md bg-gradient-to-b from-white/15 to-transparent" />

              {/* Optimized: CSS-only hover animation */}
              <svg
                className="relative z-10 h-3 w-3 flex-shrink-0 transition-transform duration-300 ease-out group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="7" r="4" fill="currentColor" />
                <path
                  d="M12 12c-4 0-8 2-8 5v2h16v-2c0-3-4-5-8-5z"
                  fill="currentColor"
                />
              </svg>

              <span className="relative z-10 whitespace-nowrap leading-none">
                With Driver
              </span>
            </motion.div>
          )}
        </motion.div>
      </>
    );
  }
);

VehicleRentalTypeBadges.displayName = "VehicleRentalTypeBadges";

export default VehicleRentalTypeBadges;
