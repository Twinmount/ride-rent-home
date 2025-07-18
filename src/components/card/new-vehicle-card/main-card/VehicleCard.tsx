import { NewVehicleCardType } from "@/types/vehicle-types";
import { generateVehicleDetailsUrl } from "@/helpers";
import VehicleThumbnail from "../VehicleThumbnail";
import RentalDetails from "../RentalDetails";
import LinkWrapper from "../LinkWrapper";
import MotionStaggeredArticle from "@/components/general/framer-motion/MotionStaggeredArticle";
import RentNowDialogTrigger from "../RentNowDialogTrigger";
import VehicleRating from "../VehicleRating";
import { VehicleBadgesGroup } from "../vehicle-badge/VehicleBadgesGroup";

type VehicleCardProps = {
  vehicle: NewVehicleCardType;
  index: number;
  country: string;
};

const VehicleCard = ({ vehicle, index, country = "ae" }: VehicleCardProps) => {
  // dynamic link to navigate to vehicle details page
  const vehicleDetailsPageLink = generateVehicleDetailsUrl({
    vehicleTitle: vehicle.vehicleTitle,
    state: vehicle.state,
    vehicleCategory: vehicle.vehicleCategory,
    vehicleCode: vehicle.vehicleCode,
    country: country,
  });

  return (
    <MotionStaggeredArticle
      index={index}
      className="flex w-[16.375rem] min-w-[16.375rem] flex-col gap-4 rounded border border-border-default bg-white p-3 md:w-[17.1875rem] md:min-w-[17.1875rem] lg:w-[18.4375rem] lg:min-w-[18.4375rem]"
    >
      {/* card top */}
      <LinkWrapper
        href={vehicleDetailsPageLink}
        className="h-full w-full space-y-4"
      >
        <div className="relative">
          {/* thumbnail */}
          <VehicleThumbnail
            src={vehicle.thumbnail}
            alt={vehicle.vehicleTitle || "Vehicle Image"}
            width={250}
            height={200}
          />

          {/* badge group */}
          <VehicleBadgesGroup
            hasZeroDeposit={!vehicle.securityDeposit.enabled}
            hasFancyNumber={true}
            hasHourlyRental={!!vehicle?.rentalDetails?.hour?.enabled}
          />
        </div>

        <div className="flex-between flex gap-x-2">
          <h3 className="line-clamp-1 text-base font-semibold lg:text-xl">
            {vehicle.vehicleTitle}
          </h3>

          <VehicleRating rating={vehicle.rating} />
        </div>
      </LinkWrapper>

      {/* card bottom */}
      <div className="flex-between">
        <LinkWrapper
          href={vehicleDetailsPageLink}
          className="flex h-full w-full items-center"
        >
          <RentalDetails rentalDetails={vehicle.rentalDetails} />
        </LinkWrapper>

        <RentNowDialogTrigger vehicle={vehicle} />
      </div>
    </MotionStaggeredArticle>
  );
};

export default VehicleCard;
