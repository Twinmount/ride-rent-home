import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AnimatedPriceDisplayProps = {
  price: string;
  period: string;
  minBookingHours: number;
  convert: (amount: number, type: "prefix" | "current") => string;
  isDisabled?: boolean;
};

const AnimatedPriceDisplay = ({
  price,
  period,
  minBookingHours,
  convert,
  isDisabled = false,
}: AnimatedPriceDisplayProps) => {
  const [displayPrice, setDisplayPrice] = useState("");
  const [key, setKey] = useState(0);

  // Calculate the display price
  const calculateDisplayPrice = () => {
    if (period === "Hour" && minBookingHours !== undefined) {
      return `${convert(Number(price), "prefix")} / ${minBookingHours} Hrs`;
    }
    return `${convert(Number(price), "prefix")}`;
  };

  useEffect(() => {
    const newPrice = calculateDisplayPrice();

    if (newPrice !== displayPrice) {
      setDisplayPrice(newPrice);
      setKey((prev) => prev + 1); // Force re-render with animation
    }
  }, [price, period, minBookingHours, convert]);

  return (
    <div
      className={`mb-5 mt-1 overflow-hidden text-center text-2xl font-semibold md:mb-0 md:text-left md:text-xl xl:text-2xl ${
        isDisabled ? "text-gray-400" : "text-yellow"
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{
            duration: isDisabled ? 0 : 0.1,
            ease: "easeInOut",
          }}
        >
          {displayPrice}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedPriceDisplay;