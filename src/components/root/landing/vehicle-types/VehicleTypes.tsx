"use client";

import "./VehicleTypes.scss";
import React, { useState, useEffect } from "react";
import { MdExpandMore } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { fetchVehicleTypesByValue } from "@/lib/next-api/next-api";
import { VehicleTypeType } from "@/types";
import GridSkelton from "@/components/skelton/GridSkelton";
import Link from "next/link";
import { convertToLabel, singularizeType } from "@/helpers";

const VehicleTypes = ({
  category,
  state,
}: {
  category: string;
  state: string;
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["vehicleTypes", category],
    queryFn: () => fetchVehicleTypesByValue(category),
    enabled: !!category,
  });

  const baseAssetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsSmallScreen(window.innerWidth < 768);
      }
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const vehicleTypes: VehicleTypeType[] = data?.result?.list || [];

  const visibleVehicleTypes = isSmallScreen
    ? showAllTypes
      ? vehicleTypes
      : vehicleTypes.slice(0, 6)
    : vehicleTypes;

  const handleToggleShowTypes = () => {
    setShowAllTypes(!showAllTypes);
  };

  return (
    <section className="vehicle-types-section wrapper">
      <h1>
        Choose the{" "}
        <span className="yellow-gradient selected-type">
          {convertToLabel(singularizeType(category))}
        </span>{" "}
        type that is convenient for you
      </h1>
      {isLoading ? (
        <GridSkelton count={4} />
      ) : (
        <div className="vehicle-types-container">
          {visibleVehicleTypes.map((type) => (
            <Link
              href={`/${state}/listing?category=${category}&vehicleTypes=${type.value}`}
              key={type.typeId}
              className="vehicle-types-card"
            >
              <div className="top">
                <img
                  width={100}
                  height={100}
                  src={`${baseAssetsUrl}/icons/vehicle-types/${category}/${type.value}.webp`}
                  alt={`${type.name} Icon`}
                />
              </div>
              <p className="caption">{type.name}</p>
            </Link>
          ))}
        </div>
      )}
      {vehicleTypes.length > 6 && isSmallScreen && !isLoading && (
        <button
          className={`show-more-button ${showAllTypes ? "expanded" : ""}`}
          onClick={handleToggleShowTypes}
        >
          {showAllTypes ? "Show less" : "Show more"}{" "}
          <MdExpandMore className="icon" />
        </button>
      )}
    </section>
  );
};

export default VehicleTypes;
