"use client";

import { NewVehicleCardType } from "@/types/vehicle-types";
import { generateVehicleDetailsUrl, getVehicleCardStyle } from "@/helpers";
import VehicleThumbnail from "../VehicleThumbnail";
import RentalDetails from "../RentalDetails";
import LinkWrapper from "../LinkWrapper";
import RentNowDialogTrigger from "../RentNowDialogTrigger";
import { VehicleBadgesGroup } from "../vehicle-badge/VehicleBadgesGroup";
import CardTitle from "../CardTitle";
import { useAuthContext } from "@/auth";
import { cn } from "@/lib/utils";

type VehicleCardProps = {
  vehicle: NewVehicleCardType;
  index: number;
  country: string;
  layoutType: "grid" | "carousel";
  openInNewTab?: boolean;
};

const VehicleCard = ({
  vehicle,
  index,
  country = "ae",
  layoutType,
  openInNewTab = false,
}: VehicleCardProps) => {
  const { auth, onHandleLoginmodal } = useAuthContext();

  const vehicleDetailsPageLink = generateVehicleDetailsUrl({
    country: country,
    state: vehicle.state,
    vehicleCategory: vehicle.vehicleCategory,
    vehicleTitle: vehicle.vehicleTitle,
    vehicleCode: vehicle.vehicleCode,
  });

  const handleCardClick = (e: React.MouseEvent): void => {
    if (!auth.isLoggedIn) {
      e.preventDefault();
      e.stopPropagation();
      onHandleLoginmodal({ isOpen: true });
    }
  };

  const classes = getVehicleCardStyle(layoutType);

  return (
    <div
      className={cn(
        `flex w-full flex-col gap-3 rounded border border-border-default bg-white p-2`,
        classes
      )}
    >
      <LinkWrapper
        href={vehicleDetailsPageLink}
        className={`h-full w-full space-y-3 ${!auth.isLoggedIn ? "cursor-pointer" : ""}`}
        newTab={openInNewTab}
      >
        <div className="relative">
          <VehicleThumbnail
            src={vehicle.thumbnail}
            alt={`${vehicle.vehicleTitle} rental car available for booking`}
            width={250}
            height={200}
            layoutType={layoutType}
            vehiclePhotos={vehicle.vehiclePhotos}
            priority={index < 2}
            loading={index < 2 ? "eager" : "lazy"}
          />

          <VehicleBadgesGroup
            hasZeroDeposit={!vehicle.securityDeposit?.enabled}
            hasFancyNumber={vehicle.isFancyNumber}
            hasHourlyRental={!!vehicle?.rentalDetails?.hour?.enabled}
          />
        </div>

        <CardTitle
          vehicleTitle={vehicle.vehicleTitle}
          rating={vehicle.rating}
          layoutType={layoutType}
        />
      </LinkWrapper>

      <div className="flex-between">
        <LinkWrapper
          href={auth.isLoggedIn ? vehicleDetailsPageLink : "#"}
          className={`flex h-full w-full items-center ${!auth.isLoggedIn ? "cursor-pointer" : ""}`}
          newTab={openInNewTab}
          onClick={handleCardClick}
        >
          <RentalDetails
            rentalDetails={vehicle.rentalDetails}
            layoutType={layoutType}
          />
        </LinkWrapper>

        <RentNowDialogTrigger
          country={country}
          vehicle={vehicle}
          layoutType={layoutType}
        />
      </div>
    </div>
  );
};

export default VehicleCard;
