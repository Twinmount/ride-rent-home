import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { MdOutlineClose, MdOutlineVerifiedUser } from "react-icons/md";
import SafeImage from "@/components/common/SafeImage";

type BestPriceGuaranteeProps = {
  isDisabled?: boolean;
};

const BestPriceGuarantee = ({
  isDisabled = false,
}: BestPriceGuaranteeProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    if (isDisabled) return;
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  // Animation variants for the shield icon (coming from left)
  const shieldVariants: Variants = {
    hidden: { x: -200, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Animation variants for the text (coming from right)
  const textVariants: Variants = {
    hidden: { x: 200, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Shaking animation that starts after the slide-in completes
  const shakeVariants: Variants = {
    initial: {},
    shake: {
      x: isDisabled ? 0 : [0, -2, 2, -2, 2, 0],
      transition: {
        duration: 0.5,
        delay: 1,
        repeat: isDisabled ? 0 : 2,
        repeatDelay: 2,
      },
    },
  };

  // Pulsing glow animation for the shield in modal
  const shieldGlowVariants: Variants = {
    initial: { scale: 1, filter: "drop-shadow(0 0 0px rgba(255, 215, 0, 0))" },
    animate: {
      scale: [1, 1.05, 1],
      filter: [
        "drop-shadow(0 0 0px rgba(255, 215, 0, 0))",
        "drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))",
        "drop-shadow(0 0 0px rgba(255, 215, 0, 0))",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
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
          className={`flex items-center gap-x-1 transition-colors ${
            isDisabled
              ? "cursor-not-allowed text-gray-400"
              : "text-yellow hover:text-orange"
          }`}
          disabled={isDisabled}
          aria-label="Open Best Price Guarantee information"
        >
          {/* Shield Icon - slides in from left */}
          <motion.div
            variants={shieldVariants}
            initial="hidden"
            animate="visible"
          >
            <MdOutlineVerifiedUser
              className={`h-4 w-4 ${isDisabled ? "text-gray-400" : "text-yellow"}`}
              aria-hidden="true"
            />
          </motion.div>

          {/* Text - slides in from right */}
          <motion.span
            className={`text-sm font-medium underline ${
              isDisabled ? "text-gray-400" : "text-yellow"
            }`}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            Best Price Guarantee
          </motion.span>
        </button>
      </motion.div>

      {/* Modal Popup */}
      {isModalOpen && !isDisabled && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <motion.div
            className="relative w-full max-w-lg rounded-2xl bg-white p-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 rounded text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow focus:ring-opacity-50"
              aria-label="Close modal"
            >
              <MdOutlineClose className="h-5 w-5" />
            </button>

            {/* Animated Shield Icon */}
            <motion.div
              className="mb-4 flex justify-center"
              variants={shieldGlowVariants}
              initial="initial"
              animate="animate"
            >
              <div className="flex items-center justify-center">
                <SafeImage
                  src="/assets/img/detailsPage/shield.webp"
                  alt="Security shield representing our lowest price guarantee"
                  width={250}
                  height={250}
                  priority
                />
              </div>
            </motion.div>

            {/* Title */}
            <h2
              id="modal-title"
              className="mb-4 text-center text-xl font-semibold text-black"
            >
              Lowest Price Guarantee!
            </h2>

            {/* Description */}
            <div
              id="modal-description"
              className="space-y-4 text-center text-text-secondary"
            >
              <p className="text-sm md:text-lg">
                Helping you get the lowest prices every time.
              </p>

              <p className="text-[0.45rem] text-text-tertiary">
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
