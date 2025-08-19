import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { MdOutlineClose, MdOutlineVerifiedUser } from 'react-icons/md';

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
        className="m-4 flex justify-center"
        variants={shakeVariants}
        initial="initial"
        animate="shake"
      >
        <button
          onClick={openModal}
          className="text-orange-500 hover:text-orange-600 flex items-center gap-x-1 transition-colors"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="relative w-full max-w-md rounded-2xl bg-white p-6"
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
              <div className="from-yellow-400 to-orange-500 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br">
                <MdOutlineVerifiedUser
                  className="h-10 w-10 text-white"
                  fill="currentColor"
                />
              </div>
            </div>

            {/* Title */}
            <h2 className="mb-4 text-center text-2xl font-bold text-yellow">
              Lowest Price Guarantee!
            </h2>

            {/* Description */}
            <div className="space-y-4 text-center text-gray-600">
              <p className="text-sm">
                At Ride.Rent We are Committed to Helping You Get the Lowest
                Prices Every Time.
              </p>

              <p className="text-sm">
                We Use Advanced Machine Learning and Expert Insights to Track
                Local Rates, Compare Prices and Apply Smart Pricing Strategies
                So You Always Get the Best Rental Deals.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default BestPriceGuarantee;
