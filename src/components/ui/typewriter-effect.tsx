"use client";

import { convertToLabel, singularizeType } from "@/helpers";
import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect, useMemo } from "react";

// Helper function to generate the words array
const generateWordsArray = (state: string, category: string) => {
  const splitIntoWords = (text: string, className: string) => {
    return text.split(" ").map((word) => ({
      text: word,
      className,
    }));
  };

  const formattedCategory = singularizeType(convertToLabel(category));
  const formattedState = convertToLabel(state);

  return [
    { text: "Rent", className: "text-slate-800" },
    { text: "a", className: "text-slate-800" },
    ...splitIntoWords(formattedCategory, "text-slate-850"),
    { text: "In", className: "text-slate-800" },
    ...splitIntoWords(formattedState, "text-slate-850"),
  ];
};

export const TypewriterEffect = ({
  state,
  category,
  className,
  cursorClassName,
}: {
  state: string;
  category: string;
  className?: string;
  cursorClassName?: string;
}) => {
  const words = useMemo(
    () => generateWordsArray(state, category),
    [state, category],
  );

  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
          width: "fit-content",
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: "easeInOut",
        },
      );
    }
  }, [isInView]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{}}
                  key={`char-${index}`}
                  className={cn(
                    `hidden text-black opacity-0 dark:text-white`,
                    word.className,
                  )}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </motion.div>
    );
  };
  return (
    <div
      className={cn(
        "text-center text-3xl font-bold md:text-4xl lg:text-5xl",
        className,
      )}
    >
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block h-6 w-[4px] rounded-sm bg-yellow md:h-8 lg:h-10",
          cursorClassName,
        )}
      ></motion.span>
    </div>
  );
};
