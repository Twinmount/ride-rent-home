"use client";

import { FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MotionDiv from "@/components/general/framer-motion/MotionDiv";
import "./Specification.scss";
import { formatKeyForIcon } from "@/helpers";

// Update the SpecificationItem type based on the current Specs structure
interface SpecificationItem {
  name: string;
  value: string;
  selected: boolean;
  hoverInfo?: string;
}

// Update the SpecificationsProps type to match the Specs type
type SpecificationsProps = {
  specifications: Record<string, SpecificationItem>;
  vehicleCategory?: string;
};

const Specification: FC<SpecificationsProps> = ({
  specifications,
  vehicleCategory,
}) => {
  // Base URL for fetching icons
  const baseAssetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;

  return (
    <MotionDiv className="specification-container">
      <h2 className="custom-heading">Specifications</h2>
      <div className="specifications">
        {/* Iterate through specifications and display each one */}
        {Object.entries(specifications).map(([key, spec]) => {
          return (
            <div className="specification" key={key}>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger className="flex  gap-1 w-full">
                    <div className="spec-icon-box">
                      {/* Using the formatted spec name to dynamically fetch the icon */}
                      <img
                        src={`${baseAssetsUrl}/icons/vehicle-specifications/${vehicleCategory}/${formatKeyForIcon(
                          key
                        )}.svg`}
                        alt={`${key} icon`}
                        className="spec-icon"
                      />
                    </div>
                    <div className="spec-details">
                      <span className="spec-label">{key}</span>
                      <span className="spec-value">{spec.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-800 text-white rounded-xl shadow-md">
                    <p>{`${spec?.hoverInfo || key}`}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        })}
      </div>
    </MotionDiv>
  );
};

export default Specification;
