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

  // Conditionally set the dimensions based on layoutType
  const classes =
    layoutType === 'carousel'
      ? {
          dimensions:
            'w-[14.64rem] min-w-[14.4rem] md:w-[14.84rem] md:min-w-[14.84rem] lg:w-[14.6rem] lg:min-w-[14.3rem] ',
        }
      : {
          dimensions:
            'w-[12rem] min-w-[12rem] md:w-[15rem] md:min-w-[15rem] lg:w-[13.5rem] lg:min-w-[13.5rem] xl:min-w-[12.8rem] xl:w-[12.8rem] 2xl:min-w-[14rem] 2xl:w-[14rem]',
        };

  return (
    <MotionStaggeredArticle
      index={index}
      className={`flex flex-col gap-4 rounded border border-border-default bg-white p-2 ${classes.dimensions}`}
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
            alt={vehicle.vehicleTitle || 'Vehicle Image'}
            width={250}
            height={200}
            layoutType={layoutType}
          />

          {/* badge group */}
          <VehicleBadgesGroup
            hasZeroDeposit={!vehicle.securityDeposit.enabled}
            hasFancyNumber={true}
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

        <RentNowDialogTrigger vehicle={vehicle} layoutType={layoutType} />
      </div>
    </MotionStaggeredArticle>
  );
};

export default VehicleCard;
