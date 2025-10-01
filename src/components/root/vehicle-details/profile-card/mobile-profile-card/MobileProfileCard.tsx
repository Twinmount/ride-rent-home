import { ProfileCardDataType } from "@/types/vehicle-details-types";
import RentNowButtonWide from "@/components/common/RentNowbuttonWide";

type MobileProfileCardProps = {
  profileData: ProfileCardDataType;
  country: string;
};

const MobileProfileCard = ({
  profileData,
  country,
}: MobileProfileCardProps) => {
  // Destructure the needed values from profileData
  const {
    company,
    vehicleData: { state, model },
  } = profileData;

  return (
    <>
      {/* Mobile Profile Card - Simple Layout */}
      <div className="fixed bottom-2 z-20 w-[96%] pr-4 lg:hidden">
        <div>
          <RentNowButtonWide
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
