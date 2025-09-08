import { NewVehicleCardType } from "@/types/vehicle-types";
import { generateVehicleDetailsUrl, getVehicleCardStyle } from "@/helpers";
import VehicleThumbnail from "../VehicleThumbnail";
import RentalDetails from "../RentalDetails";
import LinkWrapper from "../LinkWrapper";
import MotionStaggeredArticle from "@/components/general/framer-motion/MotionStaggeredArticle";
import RentNowDialogTrigger from "../RentNowDialogTrigger";
import { VehicleBadgesGroup } from "../vehicle-badge/VehicleBadgesGroup";
import CardTitle from "../CardTitle";

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
  // dynamic link to navigate to vehicle details page
  const vehicleDetailsPageLink = generateVehicleDetailsUrl({
    vehicleTitle: vehicle.vehicleTitle,
    state: vehicle.state,
    vehicleCategory: vehicle.vehicleCategory,
    vehicleCode: vehicle.vehicleCode,
    country: country,
  });

  const classes = getVehicleCardStyle(layoutType);

  return (
    <MotionStaggeredArticle
      index={index}
      className={`flex w-full max-w-full flex-col gap-3 rounded border border-border-default bg-white p-2 ${classes}`}
    >
      {/* card top */}
      <LinkWrapper
        href={vehicleDetailsPageLink}
        className="h-full w-full space-y-3"
        newTab={openInNewTab}
      >
        <div className="relative">
          {/* thumbnail with hover image cycling */}
          <VehicleThumbnail
            src={vehicle.thumbnail}
            alt={vehicle.vehicleTitle || "Vehicle Image"}
            width={250}
            height={200}
            layoutType={layoutType}
            vehiclePhotos={vehicle.vehiclePhotos} // Pass the additional photos
          />

          {/* badge group */}
          <VehicleBadgesGroup
            hasZeroDeposit={!vehicle.securityDeposit.enabled}
            hasFancyNumber={vehicle.isFancyNumber} // Use actual value instead of hardcoded true
            hasHourlyRental={!!vehicle?.rentalDetails?.hour?.enabled}
          />
        </div>

        <CardTitle
          vehicleTitle={vehicle.vehicleTitle}
          rating={vehicle.rating}
          layoutType={layoutType}
        />
      </LinkWrapper>

      {/* card bottom */}
      <div className="flex-between">
        <LinkWrapper
          href={vehicleDetailsPageLink}
          className="flex h-full w-full items-center"
          newTab={openInNewTab}
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
    </MotionStaggeredArticle>
  );
};

export default VehicleCard;
