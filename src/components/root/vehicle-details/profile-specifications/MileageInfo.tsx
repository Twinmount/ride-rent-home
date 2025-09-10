import React from 'react';
import { Infinity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type MileageInfoProps = {
  unlimitedMileage: boolean;
  mileageLimit?: string;
  isDisabled?: boolean;
};

const MileageInfo = ({
  unlimitedMileage,
  mileageLimit,
  isDisabled = false,
}: MileageInfoProps) => {
  return (
    <>
      <div
        className={`m-4 flex items-center gap-x-2 text-sm ${
          isDisabled ? "text-gray-400" : "text-text-secondary"
        }`}
      >
        <AnimatePresence mode="wait">
          {unlimitedMileage ? (
            <motion.div
              key="unlimited"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: isDisabled ? 0 : 0.1, ease: "easeInOut" }}
              className="flex items-center gap-x-2"
            >
              <Infinity
                className={`h-5 w-5 flex-shrink-0 ${
                  isDisabled ? "text-gray-400" : "animate-pulse text-yellow"
                }`}
              />
              <div className="relative overflow-hidden">
                <span className={isDisabled ? "" : "shine-text"}>
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
              transition={{
                duration: isDisabled ? 0 : 0.08,
                ease: "easeInOut",
              }}
              className="flex items-center gap-1"
            >
              <div className="relative h-[18px] w-[18px] flex-shrink-0">
                <Image
                  src="/assets/icons/detail-page/top-speed.svg"
                  alt="top speed"
                  fill
                  className={`object-contain ${isDisabled ? "opacity-50" : ""}`}
                  sizes="18px"
                />
              </div>
              <span>Mileage Limit: {mileageLimit} KM</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isDisabled && (
        <style jsx>{`
          .shine-text {
            background: linear-gradient(
              90deg,
              var(--text-secondary) 0%,
              var(--text-tertiary) 50%,
              #ffa733 100%
            );
            background-size: 200% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            animation: shine 5s ease-in-out infinite;
          }

          @keyframes shine {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}</style>
      )}
    </>
  );
};

export default MileageInfo; 