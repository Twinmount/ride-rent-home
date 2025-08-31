import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { MdOutlineClose, MdOutlineVerifiedUser } from 'react-icons/md';
import Image from 'next/image';

const BestPriceGuarantee = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Animation variants for the shield icon (coming from left)
  const shieldVariants: Variants = {
    hidden: { x: -200, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  // Animation variants for the text (coming from right)
  const textVariants: Variants = {
    hidden: { x: 200, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  // Shaking animation that starts after the slide-in completes
  const shakeVariants: Variants = {
    initial: {},
    shake: {
      x: [0, -2, 2, -2, 2, 0],
      transition: {
        duration: 0.5,
        delay: 1, // Start shaking 1 second after slide-in completes
        repeat: 2, // Shake 3 times total
        repeatDelay: 2, // Wait 2 seconds between shake cycles
      },
    },
  };

  return (
    <>
      {/* Animated Best Price Guarantee Text */}
      <motion.div
        className="flex justify-center pb-2"
        variants={shakeVariants}
        initial="initial"
        animate="shake"
      >
        <button
          onClick={openModal}
          className="flex items-center gap-x-1 text-yellow transition-colors hover:text-orange"
        >
          {/* Shield Icon - slides in from left */}
          <motion.div
            variants={shieldVariants}
            initial="hidden"
            animate="visible"
          >
            <MdOutlineVerifiedUser className="h-4 w-4 text-yellow" />
          </motion.div>

          {/* Text - slides in from right */}
          <motion.span
            className="text-sm font-medium text-yellow underline"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            Best Price Guarantee
          </motion.span>
        </button>
      </motion.div>

      {/* Modal Popup */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 hidden items-center justify-center bg-black bg-opacity-50 p-4 md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="relative w-full max-w-lg rounded-2xl bg-white p-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <MdOutlineClose className="h-5 w-5" />
            </button>

            {/* Shield Icon */}
            <div className="mb-4 flex justify-center">
              <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br">
                <Image
                  src="/assets/img/detailsPage/shield.webp"
                  alt="Shield Icon"
                  width={250}
                  height={250}
                />
              </div>
            </div>

            {/* Title - Normal black text with xl size */}
            <h2 className="mb-4 text-center text-xl font-semibold text-black">
              Lowest Price Guarantee!
            </h2>

            {/* Description */}
            <div className="space-y-4 text-center text-text-tertiary">
              <p className="text-sm md:text-lg">
                Helping you get the lowest prices every time.
              </p>

              <p className="text-xs text-text-secondary">
                We use advanced machine learning and AI driven insights to track
                local rates, compare prices, and apply smart pricing strategies
                so you always get the best deals.​
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default BestPriceGuarantee;