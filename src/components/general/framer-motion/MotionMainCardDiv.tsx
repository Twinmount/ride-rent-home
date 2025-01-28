"use client";

import { motion } from "framer-motion";
import React, { CSSProperties, FC, ReactNode } from "react";

interface MotionMainCardDivProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  style?: CSSProperties;
  once?: boolean; // Option to control if animation should only trigger once
  index?: number;
}

const MotionMainCardDiv: FC<MotionMainCardDivProps> = ({
  children,
  className,
  style,
  once = true,
  index,
}) => {
  const categoryVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.25,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.div
      viewport={{ once, amount: 0.2 }}
      className={className}
      style={style}
      custom={index}
      initial="hidden"
      animate="visible"
      variants={categoryVariants}
    >
      {children}
    </motion.div>
  );
};

export default MotionMainCardDiv;
