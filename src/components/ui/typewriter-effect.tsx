"use client";

import { convertToLabel, singularizeType } from "@/helpers";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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
  const formattedCategory = singularizeType(convertToLabel(category));
  const formattedState = convertToLabel(state);
  const fullText = `Rent a ${formattedCategory} in ${formattedState}`;

  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 2500); // Wait until typewriter animation ends

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "text-center text-3xl font-bold md:text-4xl lg:text-5xl",
        className,
      )}
    >
      <div
        className={cn(
          "animate-typewriter delay-[500ms] inline-block max-w-full overflow-hidden whitespace-nowrap border-r-2 text-black dark:text-white",
          !showText && "opacity-0",
        )}
      >
        {fullText}
        <span
          className={cn(
            "animate-blink ml-[10px] inline-block h-6 w-[4px] bg-yellow md:h-8 lg:h-10",
            cursorClassName,
          )}
        ></span>
      </div>

      <style jsx>{`
        @keyframes typewriter {
          0% {
            width: 0;
            opacity: 1;
          }
          100% {
            width: 100%;
            opacity: 1;
          }
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        .animate-typewriter {
          animation: typewriter 2s steps(30) forwards;
        }

        .animate-blink {
          animation: blink 1s step-start infinite;
        }
      `}</style>
    </div>
  );
};
