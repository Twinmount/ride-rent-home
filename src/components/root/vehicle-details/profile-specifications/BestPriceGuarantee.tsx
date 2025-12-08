import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineClose, MdOutlineVerifiedUser } from "react-icons/md";
import { FiCheck, FiClock, FiDatabase, FiCpu } from "react-icons/fi";

type BestPriceGuaranteeProps = {
  isDisabled?: boolean;
};

const BestPriceGuarantee = ({
  isDisabled = false,
}: BestPriceGuaranteeProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleEscape = (e: KeyboardEvent) =>
      e.key === "Escape" && setIsModalOpen(false);
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const features = [
    {
      icon: FiClock,
      title: "Real-Time",
      desc: "Price tracking every second",
      span: "col-span-2 sm:col-span-1",
    },
    {
      icon: FiDatabase,
      title: "10M+",
      desc: "Price points analyzed daily",
      span: "col-span-2 sm:col-span-1",
    },
    {
      icon: FiCpu,
      title: "ML Algorithm",
      desc: "Advanced machine learning predicts and optimizes pricing patterns.",
      span: "col-span-4 sm:col-span-2",
    },
  ];

  return (
    <>
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: isDisabled ? 0 : [0, -2, 2, -2, 2, 0] }}
        transition={{
          duration: 0.5,
          delay: 1,
          repeat: isDisabled ? 0 : 2,
          repeatDelay: 2,
        }}
      >
        <button
          onClick={() => !isDisabled && setIsModalOpen(true)}
          className={`flex items-center gap-x-1 transition-colors ${
            isDisabled
              ? "cursor-not-allowed text-gray-400"
              : "text-yellow hover:text-orange"
          }`}
          disabled={isDisabled}
          aria-label="Open Best Price Guarantee information"
        >
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <MdOutlineVerifiedUser
              className={`h-4 w-4 ${isDisabled ? "text-gray-400" : "text-yellow"}`}
            />
          </motion.div>
          <motion.span
            className={`text-[0.81rem] font-medium underline ${isDisabled ? "text-gray-400" : "text-yellow"}`}
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Best Price Guarantee
          </motion.span>
        </button>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && !isDisabled && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-[95vw] overflow-y-auto sm:max-w-md md:max-w-2xl"
              style={{ maxHeight: "90vh" }}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange/50 sm:right-4 sm:top-4 sm:h-9 sm:w-9"
                  aria-label="Close modal"
                >
                  <MdOutlineClose className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                <div className="p-4 pt-11 sm:p-6 md:p-8 md:pt-14">
                  <motion.div
                    className="mb-3 text-center sm:mb-4 md:mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="mb-1 text-lg font-black tracking-tight text-gray-900 sm:mb-1.5 sm:text-2xl md:mb-2 md:text-3xl">
                      Lowest Price{" "}
                      <span className="bg-gradient-to-r from-yellow to-orange bg-clip-text text-transparent">
                        Guaranteed
                      </span>
                    </h2>
                    <p className="text-[0.7rem] text-gray-600 sm:text-xs md:text-sm">
                      AI-powered pricing that saves you money.
                    </p>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.08, delayChildren: 0.2 }}
                  >
                    {/* Large Feature Box */}
                    <motion.div
                      className="group relative col-span-4 row-span-1 overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-yellow/5 to-orange/5 p-3 transition-all hover:shadow-lg sm:col-span-2 sm:row-span-2 sm:rounded-2xl sm:p-5 md:p-6"
                      initial={{ scale: 0.8, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 300,
                      }}
                    >
                      <div className="absolute right-0 top-0 h-16 w-16 -translate-y-4 translate-x-4 rounded-full bg-gradient-to-br from-yellow/20 to-orange/20 blur-lg sm:h-28 sm:w-28 sm:-translate-y-7 sm:translate-x-7 md:h-32 md:w-32 md:-translate-y-8 md:translate-x-8 md:blur-2xl" />
                      <div className="relative">
                        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-yellow to-orange shadow-md sm:mb-3 sm:h-12 sm:w-12 sm:rounded-xl md:mb-4 md:h-14 md:w-14 md:shadow-lg">
                          <FiCheck className="h-4.5 w-4.5 text-white sm:h-6 sm:w-6 md:h-7 md:w-7" />
                        </div>
                        <h3 className="mb-1 text-xs font-bold text-gray-900 sm:mb-1.5 sm:text-lg md:mb-2 md:text-xl">
                          Price Match Promise
                        </h3>
                        <p className="text-[0.6rem] leading-snug text-gray-600 sm:text-xs sm:leading-relaxed md:text-sm">
                          Our Best Price AI system continuously monitors market
                          trends and automatically updates rates to ensure you
                          always get the best value.
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[0.55rem] font-semibold text-orange shadow-sm sm:mt-3 sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[0.65rem] md:mt-4 md:text-xs">
                          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange sm:h-2 sm:w-2" />
                          Active 24/7
                        </div>
                      </div>
                    </motion.div>

                    {/* Feature Cards */}
                    {features.map((feature, i) => (
                      <motion.div
                        key={i}
                        className={`group ${feature.span} overflow-hidden rounded-xl border border-gray-200 bg-white p-2.5 transition-all hover:shadow-lg sm:rounded-2xl sm:p-4 md:p-5`}
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          damping: 20,
                          stiffness: 300,
                          delay: i * 0.08,
                        }}
                      >
                        <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 sm:mb-2 sm:h-10 sm:w-10 md:mb-3 md:h-12 md:w-12">
                          <feature.icon className="h-4 w-4 text-gray-700 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                        </div>
                        <h4 className="mb-0.5 text-[0.65rem] font-bold text-gray-900 sm:text-sm md:mb-1 md:text-base">
                          {feature.title}
                        </h4>
                        <p className="text-[0.55rem] leading-tight text-gray-600 sm:text-[0.65rem] md:text-xs">
                          {feature.desc}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.p
                    className="mt-2.5 text-center text-[0.55rem] leading-snug text-gray-500 sm:mt-4 sm:text-[0.65rem] sm:leading-relaxed md:mt-6 md:text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    We use advanced machine learning and AI driven insights to
                    track local rates, compare prices, and apply smart pricing
                    strategies so you always get the best deals.
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BestPriceGuarantee;
