import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import CityListSubheading from "./CityListSubheading";

type LocationProps = {
  stateLabel: string;
  cities: string[];
};

const Location: React.FC<LocationProps> = ({ stateLabel, cities }) => {
  return (
    <div className="mt-2.5 flex items-start text-[15px] text-gray-700 md:gap-0.5">
      <span className="mt-0.5 flex items-center gap-1 text-lg">
        <IoLocationOutline
          size={20}
          className="text-yellow-500 relative bottom-[2px]"
          strokeWidth={3}
          fill="yellow"
        />
      </span>
      <span className="mr-1 flex items-center whitespace-nowrap font-medium text-gray-900">
        {stateLabel} :
      </span>
      <CityListSubheading cities={cities} />
    </div>
  );
};

export default Location;
