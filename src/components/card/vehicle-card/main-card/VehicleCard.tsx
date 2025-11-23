import { NewVehicleCardType } from "@/types/vehicle-types";
import { generateVehicleDetailsUrl, getVehicleCardStyle } from "@/helpers";
import VehicleThumbnail from "../VehicleThumbnail";
import RentalDetails from "../RentalDetails";
import LinkWrapper from "../LinkWrapper";
import { VehicleBadgesGroup } from "../vehicle-badge/VehicleBadgesGroup";
import CardTitle from "../CardTitle";
import { cn } from "@/lib/utils";
import CardPriceOfferTimer from "../CardPriceOfferTimer";
import { isPriceOfferActive } from "@/helpers/price-offer.helper";
import VehicleCardButton from "../VehicleCardButton";
import VehicleFeatureBadges from "../VehicleFeatureBadges";

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
  const vehicleDetailsPageLink = generateVehicleDetailsUrl({
    country: country,
    state: vehicle.state,
    vehicleCategory: vehicle.vehicleCategory,
    vehicleTitle: vehicle.vehicleTitle,
    vehicleCode: vehicle.vehicleCode,
  });

  const classes = getVehicleCardStyle(layoutType);

  const hasActiveOffer = isPriceOfferActive(vehicle.priceOffer);

  return (
    <div
      className={cn(
        `flex w-full flex-col gap-3 rounded border border-border-default bg-white p-2`,
        classes
      )}
    >
      <LinkWrapper
        href={vehicleDetailsPageLink}
        className={`h-full w-full space-y-3`}
        newTab={openInNewTab}
      >
        <div className="relative">
          <VehicleThumbnail
            src={vehicle.thumbnail || vehicle.fallbackThumbnail}
            alt={`${vehicle.vehicleTitle} rental car available for booking`}
            width={!!vehicle.thumbnail ? 500 : 250}
            height={!!vehicle.thumbnail ? 400 : 200}
            layoutType={layoutType}
            vehiclePhotos={vehicle.vehiclePhotos}
            priority={index < 6}
            loading={index < 6 ? "eager" : "lazy"}
            quality={!!vehicle.thumbnail ? 100 : 90}
            isOptimizedThumbnail={!!vehicle.thumbnail}
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

        <VehicleFeatureBadges
          hasPayOnPickup={true}
          hasNoDeposit={!vehicle.securityDeposit.enabled}
        />
      </LinkWrapper>

      <LinkWrapper
        href={vehicleDetailsPageLink}
        className="flex-between"
        newTab={openInNewTab}
      >
        <div className={`flex h-full w-full items-center`}>
          <RentalDetails
            rentalDetails={vehicle.rentalDetails}
            layoutType={layoutType}
            hasActiveOffer={hasActiveOffer}
          />
        </div>

        {hasActiveOffer ? (
          <CardPriceOfferTimer vehicle={vehicle} layoutType={layoutType} />
        ) : (
          <VehicleCardButton layoutType={layoutType}>
            View More
          </VehicleCardButton>
        )}
      </LinkWrapper>
    </div>
  );
};

export default VehicleCard;
