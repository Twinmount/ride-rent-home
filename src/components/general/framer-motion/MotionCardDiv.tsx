"use client";

import { motion } from "framer-motion";
import React, { CSSProperties, FC, ReactNode } from "react";

interface MotionCardDivProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  style?: CSSProperties;
  once?: boolean; // Option to control if animation should only trigger once
}

const MotionCardDiv: FC<MotionCardDivProps> = ({
  children,
  className,
  duration = 0.5,
  delay = 0,
  style,
  once = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ type: "tween", duration, delay }}
      viewport={{ once }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default MotionCardDiv;
