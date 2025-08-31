import { NewVehicleCardType } from '@/types/vehicle-types';
import { generateVehicleDetailsUrl } from '@/helpers';
import VehicleThumbnail from '../VehicleThumbnail';
import RentalDetails from '../RentalDetails';
import LinkWrapper from '../LinkWrapper';
import MotionStaggeredArticle from '@/components/general/framer-motion/MotionStaggeredArticle';
import RentNowDialogTrigger from '../RentNowDialogTrigger';
import { VehicleBadgesGroup } from '../vehicle-badge/VehicleBadgesGroup';
import CardTitle from '../CardTitle';

type VehicleCardProps = {
  vehicle: NewVehicleCardType;
  index: number;
  country: string;
  layoutType: 'grid' | 'carousel';
};

const VehicleCard = ({
  vehicle,
  index,
  country = 'ae',
  layoutType,
}: VehicleCardProps) => {
  // dynamic link to navigate to vehicle details page
  const vehicleDetailsPageLink = generateVehicleDetailsUrl({
    vehicleTitle: vehicle.vehicleTitle,
    state: vehicle.state,
    vehicleCategory: vehicle.vehicleCategory,
    vehicleCode: vehicle.vehicleCode,
    country: country,
  });

  // card styles based on layout type
  const carouselCardStyle = `w-[14.64rem] min-w-[14.4rem] md:w-[14.84rem] md:min-w-[14.84rem] lg:w-[14.6rem] lg:min-w-[14.3rem] `;
  const gridCardStyle = `w-full max-w-[26rem] min-w-[12rem]`;

  // Conditionally set the styling based on layoutType
  const classes = layoutType === 'carousel' ? carouselCardStyle : gridCardStyle;

  return (
    <MotionStaggeredArticle
      index={index}
      className={`flex w-full max-w-full flex-col gap-3 rounded border border-border-default bg-white p-2 ${classes}`}
    >
      {/* card top */}
      <LinkWrapper
        href={vehicleDetailsPageLink}
        className="h-full w-full space-y-3"
      >
        <div className="relative">
          {/* thumbnail with hover image cycling */}
          <VehicleThumbnail
            src={vehicle.thumbnail}
            alt={vehicle.vehicleTitle || 'Vehicle Image'}
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