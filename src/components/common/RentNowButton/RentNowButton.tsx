import React from 'react';
import './RentNowButton.scss';

type RentNowButtonProps = {
  companyLogo?: string | null;
};

const RentNowButton: React.FC<RentNowButtonProps> = ({ companyLogo }) => {
  return (
    <div>
      {companyLogo ? (
        <div>
          <div className="rent-now-btn">
            <span className="rent-now-text">RENT NOW</span>
            <span>
              {companyLogo && <span className="green-round"></span>}
              <span className={companyLogo ? '' : 'margin-for-span'}>
                Available now for chat
              </span>
            </span>
          </div>
        </div>
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
