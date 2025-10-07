import { ProfileCardDataType } from "@/types/vehicle-details-types";
import RentNowButtonWide from "@/components/common/RentNowbuttonWide";

type MobileProfileCardProps = {
  profileData: ProfileCardDataType;
  country: string;
  vehicle: any; // Add this prop
};

const MobileProfileCard = ({
  profileData,
  country,
  vehicle, // Add this parameter
}: MobileProfileCardProps) => {
  const {
    company,
    vehicleData: { state, model },
    vehicleId, // Destructure these
    agentId, // from profileData
  } = profileData;

  return (
    <>
      <div className="fixed bottom-2 z-20 w-[96%] pr-4 lg:hidden">
        <div>
          <RentNowButtonWide
            vehicle={vehicle}
            vehicleId={vehicleId}
            agentId={agentId}
            country={country}
            contactDetails={company.contactDetails}
            vehicleName={model}
            state={state}
          />
        </div>
      </div>
    </>
  );
};

export default MobileProfileCard;
