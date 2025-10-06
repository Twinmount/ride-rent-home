"use client";
import { useState } from "react";

type VehicleDescriptionProps = {
  description?: string;
};

const VehicleDescription = ({ description }: VehicleDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) return null;

  return (
    <div className="m-2 text-sm text-text-secondary lg:text-base">
      <p className={isExpanded ? "" : "line-clamp-3"}>{description}</p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-1 font-semibold text-orange hover:text-yellow"
        type="button"
      >
        {isExpanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
};

export default VehicleDescription;
