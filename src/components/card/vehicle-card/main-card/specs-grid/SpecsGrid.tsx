import styles from "./SpecsGrid.module.scss";
import { formatKeyForIcon } from "@/helpers";
import { VehicleCardType } from "@/types/vehicle-types";

type SpecsGridProps = {
  vehicle: VehicleCardType;
};

export default function SpecsGrid({ vehicle }: SpecsGridProps) {
  // Base URL for fetching icons
  const baseAssetsUrl =
    process.env.ASSETS_URL || process.env.NEXT_PUBLIC_ASSETS_URL;

  return (
    <div className={styles.specsGrid}>
      {Object.entries(vehicle.vehicleSpecs).map(([key, spec]) => {
        return (
          <div key={key} className={styles.spec}>
            {/* Using the formatted spec name to dynamically fetch the icon */}
            <img
              src={`${baseAssetsUrl}/icons/vehicle-specifications/${
                vehicle.vehicleCategory
              }/${formatKeyForIcon(key)}.svg`}
              alt={`${spec.name} icon`}
              className={styles.specIcon}
            />
            <div className={styles.eachSpecValue}>
              {key === "Mileage" && spec.value
                ? `${spec.value} mileage range`
                : spec.name || "N/A"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
