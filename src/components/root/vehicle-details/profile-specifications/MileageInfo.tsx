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
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex items-center gap-x-2"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              <Infinity className="h-5 w-5" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
            >
              Unlimited Mileage
            </motion.span>
          </motion.div>
        ) : (
          <motion.div
            key="limited"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex items-center gap-x-2"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              <Gauge className="h-5 w-5" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
            >
              Mileage Limit: {mileageLimit} KM
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MileageInfo;