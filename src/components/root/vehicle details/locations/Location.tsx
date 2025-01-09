import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import CityListSubheading from "../CityListSubheading";
import styles from "./Location.module.scss"; // Import the CSS module
import { City } from "@/types/vehicle-details-types";

type LocationProps = {
  stateLabel: string;
  cities: City[];
};

const Location: React.FC<LocationProps> = ({ stateLabel, cities }) => {
  return (
    <div className={styles.locationContainer}>
      <span className={styles.location}>
        <IoLocationOutline
          size={20}
          className="text-yellow relative bottom-[2px]"
          strokeWidth={3}
          fill="yellow"
        />
      </span>
      <span className={styles.state}>{stateLabel} : </span>
      <CityListSubheading cities={cities} />
    </div>
  );
};

export default Location;
