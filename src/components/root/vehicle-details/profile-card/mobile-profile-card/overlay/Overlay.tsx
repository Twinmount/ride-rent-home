"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import "./Overlay.scss";

type OverlayProps = {
  isVisible: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

const Overlay = ({ isVisible, setIsExpanded }: OverlayProps) => {
  const handleClick = () => setIsExpanded(false);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }} // Semi-transparent effect
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={handleClick}
          className={`black-overlay ${isVisible ? "visible" : "hidden"}`}
        />
      )}
    </AnimatePresence>
  );
};

export default Overlay;
