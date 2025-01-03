import styles from "./AddOnServices.module.scss";
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
    <div className={styles.addOns}>
      <div className={styles.addOnsHeading}>
        Add-on Services <span className={styles.colon}>:</span>
      </div>
      <div className={styles.addOnsServices}>
        {additionalVehicleTypes.map((type, index) => (
          <span key={index} className={styles.addOnsItem}>
            {formatAdditionalTypeName(type.name)}
            {index === additionalVehicleTypes.length - 1 ? "." : ", "}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AddOnServices;
