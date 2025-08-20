import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

type AnimatedPriceDisplayProps = {
  price: string;
  period: string;
  minBookingHours: number;
  convert: (amount: number, type: 'prefix' | 'current') => string;
};

const AnimatedPriceDisplay = ({
  price,
  period,
  minBookingHours,
  convert
}: AnimatedPriceDisplayProps) => {
  const [displayPrice, setDisplayPrice] = useState('');
  const [key, setKey] = useState(0);

  // Calculate the display price
  const calculateDisplayPrice = () => {
    
    if (period === 'Hour' && minBookingHours !== undefined) {
      return `${convert(Number(price), 'prefix')} / ${minBookingHours} Hrs`;
    }
    return `${convert(Number(price), 'prefix')}`;
  };

  useEffect(() => {
    const newPrice = calculateDisplayPrice();

    if (newPrice !== displayPrice) {
      setDisplayPrice(newPrice);
      setKey((prev) => prev + 1); // Force re-render with animation
    }
  }, [price, period, minBookingHours, convert]); 

  // Split the price into individual characters for animation
  const characters = displayPrice.split('');

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      }
    }
  };

  const characterVariants: Variants = {
    hidden: {
      y: -20,
      opacity: 0,
      rotateX: -90,
      scale: 0.8
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        duration: 0.6
      }
    },
    exit: {
      y: 20,
      opacity: 0,
      rotateX: 90,
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  };

  // Special animation for numbers (more dramatic effect)
  const numberVariants: Variants = {
    hidden: {
      y: -30,
      opacity: 0,
      rotateX: -180,
      scale: 0.5
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 150,
        duration: 0.8
      }
    },
    exit: {
      y: 30,
      opacity: 0,
      rotateX: 180,
      scale: 0.5,
      transition: { duration: 0.4 }
    }
  };

  const isNumber = (char: string) => /[0-9]/.test(char);

  return (
    <div className="mb-5 mt-1 overflow-hidden text-center text-2xl font-bold text-yellow md:mb-0 md:text-left">
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ perspective: 1000 }}
        >
          {characters.map((char, index) => (
            <motion.span
              key={`${char}-${index}-${key}`}
              variants={isNumber(char) ? numberVariants : characterVariants}
              className={`inline-block ${isNumber(char) ? 'font-black' : ''}`}
              style={{
                transformOrigin: 'center center',
                transformStyle: 'preserve-3d',
              }}
            >
              {char === ' ' ? '\u00A0' : char}{' '}
              {/* Replace space with non-breaking space */}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedPriceDisplay;