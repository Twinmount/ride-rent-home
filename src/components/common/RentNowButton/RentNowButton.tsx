import React from "react";
import Link from "next/link";
import "./RentNowButton.scss";

type RentNowButtonProps = {
  vehicleDetailsPageLink: string;
  companyLogo?: string | null;
};

const RentNowButton: React.FC<RentNowButtonProps> = ({
  vehicleDetailsPageLink,
  companyLogo,
}) => {
  return (
    <div>
      {companyLogo ? (
        <Link href={vehicleDetailsPageLink}>
          <div className="rent-now-btn">
            <span className="rent-now-text">RENT NOW</span>
            <span>
              {companyLogo && <span className="green-round"></span>}
              <span className={companyLogo ? "" : "margin-for-span"}>
                Available now for chat
              </span>
            </span>
          </div>
        </Link>
      ) : (
        <div className="not-available-div">
          <div>Currently Unavailable/ </div>
          <span>Vehicle On Trip</span>
        </div>
      )}
    </div>
  );
};

export default RentNowButton;
