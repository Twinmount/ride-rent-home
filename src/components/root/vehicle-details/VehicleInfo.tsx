import { RentalDetailsType } from "@/types/vehicle-types";
import RentalInfo from "./RentalInfo";
import NoDeposit from "./NoDeposit";
import { formatVehicleSpecification } from "@/helpers";
import AddOnServices from "./AddOnServices";
import Location from "./Location";
import { AdditionalVehicleTypes } from "@/types/vehicle-details-types";

interface VehicleInfoProps {
  vehicleId: string;
  modelName: string;
  stateLabel: string;
  isCryptoAccepted: boolean;
  rentalDetails: RentalDetailsType;
  securityDepositEnabled: boolean;
  vehicleSpecification: string;
  additionalVehicleTypes?: AdditionalVehicleTypes[];
  cities: string[];
}

export const VehicleInfo: React.FC<VehicleInfoProps> = async ({
  modelName,
  stateLabel,
  isCryptoAccepted,
  rentalDetails,
  securityDepositEnabled,
  vehicleSpecification,
  additionalVehicleTypes,
  cities,
}) => {
  return (
    <div className="mt-4 rounded-xl bg-white p-4 shadow">
      {/* sub heading */}
      <RentalInfo
        modelName={modelName}
        isCryptoAccepted={isCryptoAccepted}
        rentalDetails={rentalDetails}
      />

      <div className="mt-2 flex flex-wrap items-center justify-start gap-2">
        <div className="flex flex-wrap items-center justify-start gap-[0.4rem]">
          {/* no deposit box */}
          {!securityDepositEnabled && <NoDeposit />}

          <div className="w-fit rounded-md bg-[#e8e8e8] px-2 py-2 text-sm font-medium leading-5 sm:text-base">
            Specification: {formatVehicleSpecification(vehicleSpecification)}
          </div>

          {/* add-on services */}
          <AddOnServices additionalVehicleTypes={additionalVehicleTypes} />
        </div>
      </div>

      {/* state and cities */}
      <Location stateLabel={stateLabel} cities={cities || []} />
    </div>
  );
};
