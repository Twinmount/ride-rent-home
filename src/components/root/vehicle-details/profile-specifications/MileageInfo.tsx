import React from 'react';
import { Infinity, Gauge } from "lucide-react";

type MileageInfoProps = {
  unlimitedMileage: boolean;
  mileageLimit?: string;
};

const MileageInfo = ({ unlimitedMileage, mileageLimit }: MileageInfoProps) => {
  return (
    <div className="flex items-center gap-x-2  text-sm text-text-secondary m-4">
      {unlimitedMileage ? (
        <>
          <Infinity className="h-5 w-5 " />
          <span>
            Unlimited Mileage
          </span>
        </>
      ) : (
        <>
          <Gauge className="h-5 w-5 " />
          <span >
            Mileage Limit : {mileageLimit} KM
          </span>
        </>
      )}
    </div>
  );
};

export default MileageInfo;