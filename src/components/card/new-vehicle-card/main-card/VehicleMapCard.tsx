import { VehicleCardType } from '@/types/vehicle-types';
import {
  convertToLabel,
  generateVehicleDetailsUrl,
  getFormattedPhoneNumber,
} from '@/helpers';

import LinkWrapper from '../LinkWrapper';
import Image from 'next/image';
import RentalDetails from '../RentalDetails';

type VehicleMapCardProps = {
  vehicle: VehicleCardType;
  country: string;
};

const VehicleMapCard = ({ vehicle, country = 'ae' }: VehicleMapCardProps) => {
  // dynamic link to navigate to vehicle details page
  const vehicleDetailsPageLink = generateVehicleDetailsUrl({
    vehicleTitle: vehicle.vehicleTitle,
    state: vehicle.state,
    vehicleCategory: vehicle.vehicleCategory,
    vehicleCode: vehicle.vehicleCode,
    country: country,
  });

  return (
    <LinkWrapper
      href={vehicleDetailsPageLink}
      className="flex w-full max-w-80 items-center gap-2 rounded border bg-white p-1 shadow-md"
    >
      <div className="relative h-16 w-24 overflow-hidden rounded">
        <Image
          src={vehicle.thumbnail}
          alt={vehicle.vehicleTitle}
          fill
          className={`h-full w-full rounded object-cover`}
        />
      </div>

      <div className="flex h-full min-h-full w-48 flex-1 flex-col justify-between gap-y-4">
        <h4 className="line-clamp-1">{vehicle.vehicleTitle}</h4>
        <RentalDetails
          rentalDetails={vehicle.rentalDetails}
          layoutType={'carousel'}
        />
      </div>
    </LinkWrapper>
  );
};

export default VehicleMapCard;
