"use client";
import { useState, useRef, useEffect } from "react";

type VehicleDescriptionProps = {
  description?: string;
};

const VehicleDescription = ({ description }: VehicleDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const isTruncated =
          textRef.current.scrollHeight > textRef.current.clientHeight;
        setShowButton(isTruncated);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [description]);

  if (!description) return null;

  return (
    <div className="p-2 text-sm text-text-secondary lg:p-1 lg:text-[0.93rem]">
      <p ref={textRef} className={isExpanded ? "" : "line-clamp-2"}>
        {description}
      </p>
      {showButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-1 text-sm font-semibold text-orange hover:text-yellow"
          type="button"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default VehicleDescription;
