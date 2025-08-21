import React from 'react';
import { Infinity, Gauge } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

type MileageInfoProps = {
  unlimitedMileage: boolean;
  mileageLimit?: string;
};

const MileageInfo = ({ unlimitedMileage, mileageLimit }: MileageInfoProps) => {
  return (
    <div className="m-4 flex items-center gap-x-2 text-sm text-text-secondary">
      <AnimatePresence mode="wait">
        {unlimitedMileage ? (
          <motion.div
            key="unlimited"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.1, ease: 'easeInOut' }}
            className="flex items-center gap-x-2"
          >
            <Infinity className="h-5 w-5 animate-pulse text-yellow" />
            <div className="relative overflow-hidden">
              <span
                className="relative bg-gradient-to-r from-text-secondary via-text-tertiary to-[#ffa733] bg-[length:200%_100%] bg-clip-text text-transparent"
                style={{
                  animation: 'shine 5s ease-in-out infinite',
                }}
              >
                Unlimited Mileage
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="limited"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.08, ease: 'easeInOut' }}
            className="flex items-center gap-x-2"
          >
            <Gauge className="h-5 w-5" />
            <span>Mileage Limit: {mileageLimit} KM</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes shine {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MileageInfo;