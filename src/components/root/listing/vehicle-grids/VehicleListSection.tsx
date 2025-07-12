"use client";

import React from "react";
import { motion } from "framer-motion";
import VehicleCard from "@/components/card/vehicle-card/main-card/VehicleCard";
import VehicleListingGridWrapper from "@/components/common/VehicleListingGridWrapper";
import VisibilityObserver from "@/components/common/VisibilityObserver";
import { convertToLabel } from "@/helpers";

type VehicleListSectionProps = {
  vehicles: Record<string, any[]>;
  state: string;
  category: string;
  country: string;
  setVisibleVehicleIds: React.Dispatch<React.SetStateAction<string[]>>;
};

/**
 * Renders a grouped list of vehicles organized by their location.
 *
 * This component displays vehicle cards sectioned by city or state.
 * If the vehicles are from a related (non-primary) state, it shows
 * a heading indicating the source location.
 *
 * Each vehicle card is wrapped in a visibility observer, enabling
 * dynamic tracking of which vehicles are currently visible in the viewport.
 * This is used to sync data with the map or other UI elements.
 *
 * The component supports animated headers and is designed to be part of
 * an infinite-scroll listing view.
 */
const VehicleListSection: React.FC<VehicleListSectionProps> = ({
  vehicles,
  state,
  category,
  country,
  setVisibleVehicleIds,
}) => {
  return (
    <>
      {Object.entries(vehicles).map(([location, vehiclesInLocation]) => {
        const locationVehicles = vehiclesInLocation as Array<{
          vehicleId: string;
        }>;
        const isFromRelatedState = location !== state;

        return (
          <div key={location} className="mb-8">
            {isFromRelatedState && (
              <h3 className="relative mb-6 inline-block break-words text-2xl font-[400] max-md:mr-auto lg:text-3xl">
                Discover more <span className="capitalize">{category}</span>{" "}
                from{" "}
                <span className="capitalize">
                  {convertToLabel(location.replace(/-/g, " "))}
                </span>
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] bg-black"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                />
              </h3>
            )}

            <VehicleListingGridWrapper>
              {locationVehicles.map((vehicle: any, index) => {
                const animationIndex = index % 8;
                return (
                  <VisibilityObserver
                    key={vehicle.vehicleId}
                    vehicle={vehicle}
                    onVisible={(id) =>
                      setVisibleVehicleIds((prev) =>
                        prev.includes(id) ? prev : [...prev, id],
                      )
                    }
                    onHidden={(id) =>
                      setVisibleVehicleIds((prev) =>
                        prev.filter((v) => v !== id),
                      )
                    }
                  >
                    <VehicleCard
                      vehicle={vehicle}
                      index={animationIndex}
                      country={country}
                    />
                  </VisibilityObserver>
                );
              })}
            </VehicleListingGridWrapper>
          </div>
        );
      })}
    </>
  );
};

export default VehicleListSection;
