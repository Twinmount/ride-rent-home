"use client";

import React from "react";
import { motion } from "framer-motion";

export const CompanyPromotionSkeleton = () => {
  return (
    <div className="flex flex-col items-center p-6">
      <div className="mb-2 h-6 w-48 animate-pulse rounded bg-gray-300" />
      <div className="h-4 w-32 animate-pulse rounded bg-gray-300" />

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="h-20 w-20 rounded-full bg-gray-300 animate-pulse" />
            <div className="mt-2 h-4 w-24 rounded bg-gray-300 animate-pulse" />
            <div className="mt-1 h-3 w-16 rounded bg-gray-300 animate-pulse" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
