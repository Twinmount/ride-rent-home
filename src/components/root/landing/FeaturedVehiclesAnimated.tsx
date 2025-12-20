"use client";

import { motion } from "framer-motion";
import VehicleCard from "@/components/card/vehicle-card/main-card/VehicleCard";
import ViewAllGridCard from "@/components/card/ViewAllGridCard";
import { NewVehicleCardType } from "@/types/vehicle-types";

type FeaturedVehiclesAnimatedProps = {
  mainVehicles: NewVehicleCardType[];
  gridThumbnails: string[];
  totalVehicles: number;
  viewAllLink: string;
  label: string;
  country: string;
};

const FeaturedVehiclesAnimated = ({
  mainVehicles,
  gridThumbnails,
  totalVehicles,
  viewAllLink,
  label,
  country,
}: FeaturedVehiclesAnimatedProps) => {
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="mx-auto flex w-fit max-w-full snap-x snap-mandatory items-center justify-between gap-1 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:max-w-[90%] lg:snap-none lg:px-1 xl:max-w-full [&::-webkit-scrollbar]:hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {mainVehicles.map((vehicle, index) => (
        <motion.div
          key={vehicle.vehicleId}
          className="flex-shrink-0 snap-start lg:snap-align-none"
          variants={itemVariants}
        >
          <VehicleCard
            vehicle={vehicle}
            index={index}
            country={country}
            layoutType="carousel"
          />
        </motion.div>
      ))}

      {gridThumbnails.length > 0 && (
        <motion.div
          className="flex-shrink-0 snap-start lg:snap-align-none"
          variants={itemVariants}
        >
          <ViewAllGridCard
            thumbnails={gridThumbnails}
            totalCount={totalVehicles}
            label={label}
            viewAllLink={viewAllLink}
            disableInternalAnimation={true}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default FeaturedVehiclesAnimated;
