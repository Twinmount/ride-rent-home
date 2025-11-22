import { ProfileCardDataType } from "@/types/vehicle-details-types";
import RentNowButtonWide from "@/components/common/RentNowbuttonWide";

type MobileProfileCardProps = {
  profileData: ProfileCardDataType;
  country: string;
  vehicle?: any;
};

const MobileProfileCard = ({
  profileData,
  country,
  vehicle,
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
            vehicleId={profileData.vehicleId}
            agentId={profileData.agentId}
            vehicle={vehicle}
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
