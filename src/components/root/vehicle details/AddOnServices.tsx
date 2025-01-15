import { formatAdditionalTypeName } from "@/helpers";
import { AdditionalVehicleTypes } from "@/types/vehicle-details-types";
import React from "react";

type AddOnServicesProps = {
  additionalVehicleTypes: AdditionalVehicleTypes[] | undefined;
};

const AddOnServices: React.FC<AddOnServicesProps> = ({
  additionalVehicleTypes,
}) => {
  if (!additionalVehicleTypes || additionalVehicleTypes.length === 0) {
    return null;
  }

  return (
    <div className="flex w-fit flex-col items-start rounded-[0.5rem] bg-gray-200 p-2 md:flex-row">
      <div className="flex items-center font-medium md:mr-2">
        Add-on Services <span className="mx-1 hidden md:inline-block">:</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-1">
        {additionalVehicleTypes.map((type, index) => (
          <span key={index} className="whitespace-nowrap text-sm">
            {formatAdditionalTypeName(type.name)}
            {index === additionalVehicleTypes.length - 1 ? "." : ", "}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AddOnServices;
