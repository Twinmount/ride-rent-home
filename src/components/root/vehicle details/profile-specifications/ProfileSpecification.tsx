import './ProfileSpecification.scss'
import { IoSpeedometer } from 'react-icons/io5'
import { CompanySpecs, RentalDetails } from '@/types/vehicle-details-types'

type ProfileSpecificationProps = {
  specs: CompanySpecs
  rentalDetails: RentalDetails
}

const ProfileSpecification = ({
  specs,
  rentalDetails,
}: ProfileSpecificationProps) => {
  // Helper function to determine which rental option to display
  const getRentalAvailability = () => {
    if (rentalDetails.month.enabled) return 'Monthly Rentals Available'
    if (rentalDetails.week.enabled) return 'Weekly Rentals Available'
    if (rentalDetails.day.enabled) return 'Daily Rentals Available'
    return 'No Rentals Available'
  }

  // Determine which rental period data to display based on priority
  const getRentalPeriodDetails = () => {
    if (rentalDetails.day.enabled) {
      return { period: 'Day', details: rentalDetails.day }
    } else if (rentalDetails.week.enabled) {
      return { period: 'Week', details: rentalDetails.week }
    } else if (rentalDetails.month.enabled) {
      return { period: 'Month', details: rentalDetails.month }
    }
    return null
  }

  const rentalPeriod = getRentalPeriodDetails()

  // Function to dynamically determine the rent price label
  const getRentPriceLabel = () => {
    if (rentalPeriod?.period === 'Day') return 'Daily Rental Rate'
    if (rentalPeriod?.period === 'Week') return 'Weekly Rental Rate'
    if (rentalPeriod?.period === 'Month') return 'Monthly Rental Rate'
    return 'Rental Rate'
  }

  return (
    <div className="profile-specifications">
      <div className="specifications">
        {/* Payment Type */}
        <div className="specification">
          <div className="icon-box">
            <img
              src="/assets/icons/profile icons/Crypto Accepted.svg"
              alt="Payment Type Icon"
            />
          </div>
          <span className="label">
            {specs.isCryptoAccepted
              ? 'Crypto Accepted'
              : 'Accepts Fiat Currencies'}
          </span>
        </div>

        {/* Delivery Option */}
        <div className="specification">
          <div className="icon-box">
            <img
              src="/assets/icons/profile icons/Spot Delivery.svg"
              alt="Delivery Option Icon"
            />
          </div>
          <span className="label">
            {specs.isSpotDeliverySupported
              ? 'Free Spot Delivery'
              : 'Collect at Point'}
          </span>
        </div>

        {/* Rental Availability */}
        <div className="specification">
          <div className="icon-box">
            <img
              src="/assets/icons/profile icons/Monthly Rental Available.svg"
              alt="Rental Availability Icon"
            />
          </div>
          <span className="label">{getRentalAvailability()}</span>
        </div>
      </div>

      {rentalPeriod && (
        <div className="mileage">
          {/* Included mileage */}
          <div className="mileage-box">
            <IoSpeedometer />
            <span className="label">{'Included mileage limit'}</span>
            <span className="value">{rentalPeriod.details.mileageLimit}</span>
          </div>
          {/* Rent Price with dynamic label */}
          <div className="mileage-box">
            <IoSpeedometer />
            <span className="label">{getRentPriceLabel()}</span>
            <span className="value">{`AED ${rentalPeriod.details.rentInAED}`}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileSpecification
