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
    <div className="add-ons">
      <div className="add-ons-heading">
        Add-on Services <span className="colon">:</span>
      </div>
      <div className="add-ons-services">
        {additionalVehicleTypes.map((type, index) => (
          <span key={index} className="add-ons-item">
            {formatAdditionalTypeName(type.name)}
            {index === additionalVehicleTypes.length - 1 ? "." : ", "}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AddOnServices;
