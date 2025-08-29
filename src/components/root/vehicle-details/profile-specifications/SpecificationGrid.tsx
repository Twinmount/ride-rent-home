type SpecificationGridProps = {
  specs: {
    isCryptoAccepted: boolean;
    isSpotDeliverySupported: boolean;
  };
};

const SpecificationGrid: React.FC<SpecificationGridProps> = ({ specs }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Payment Type */}
      {specs.isCryptoAccepted && (
        <div className="flex items-center">
          <div className="flex h-6 w-6 items-center justify-center p-0.5">
            <img
              src="/assets/icons/profile-icons/crypto-accepted.svg"
              alt="Payment Type Icon"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="ml-1 whitespace-nowrap text-sm font-light capitalize">
            Crypto Accepted
          </span>
        </div>
      )}

      {/* Delivery Option */}
      <div className="flex items-center">
        <div className="flex h-6 w-6 items-center justify-center p-0.5">
          <img
            src="/assets/icons/profile-icons/spot-delivery.svg"
            alt="Delivery Option Icon"
            className="h-full w-full object-contain"
          />
        </div>
        <span className="ml-1 text-sm font-light capitalize">
          {specs.isSpotDeliverySupported
            ? 'Free Spot Delivery'
            : 'Collect at Point'}
        </span>
      </div>

      {/* Rental Availability */}
      <div className="flex items-center">
        <div className="flex h-6 w-6 min-w-6 items-center justify-center p-0.5">
          <img
            src="/assets/icons/profile-icons/rental-icon.svg"
            alt="Rental Availability Icon"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default SpecificationGrid;
