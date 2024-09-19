import './MainCard.scss'
import Link from 'next/link'
import Image from 'next/image'
import { VehicleCardType } from '@/types/vehicle-types'
import { StateCategoryProps } from '@/types'
import { IoLocationOutline } from 'react-icons/io5'
import { formatKeyForIcon, formatPhoneNumber } from '@/helpers'
import ContactIcons from '@/components/common/contact-icons/ContactIcons'

type MainCardProps = {
  vehicle: VehicleCardType
} & StateCategoryProps

const MainCard = ({ vehicle, state, category }: MainCardProps) => {
  const formattedPhoneNumber =
    vehicle.phoneNumber && vehicle.countryCode
      ? formatPhoneNumber(vehicle.countryCode, vehicle.phoneNumber)
      : null // if null phone number

  const message = `Hello, I am interested in the ${vehicle.model}. Could you please provide more details?`
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = vehicle.whatsappPhone
    ? `https://wa.me/${vehicle.whatsappCountryCode}${vehicle.whatsappPhone}?text=${encodedMessage}`
    : null //if null WhatsApp details

  // Base URL for fetching icons
  const baseAssetsUrl = process.env.ASSETS_URL

  // Determine which rental period to display
  const rentalPeriod = vehicle.rentalDetails.day?.enabled
    ? { label: 'Day', details: vehicle.rentalDetails.day }
    : vehicle.rentalDetails.week?.enabled
    ? { label: 'Week', details: vehicle.rentalDetails.week }
    : vehicle.rentalDetails.month?.enabled
    ? { label: 'Month', details: vehicle.rentalDetails.month }
    : null

  return (
    <div className="car-card-container slide-visible">
      {/* card top */}
      <Link
        href={`/${state}/${category}/${vehicle.vehicleId}`}
        className="card-top"
      >
        <div className="image-box">
          {/* Thumbnail Image */}
          {vehicle.thumbnail ? (
            <Image
              src={vehicle.thumbnail}
              alt={vehicle.model || 'Vehicle Image'}
              width={400}
              height={400}
              className="vehicle-image"
            />
          ) : (
            <img
              src={vehicle.thumbnail} // Fallback or invalid URL handling
              alt="Vehicle Image"
              className="vehicle-image"
            />
          )}
          {/* profile */}
          {vehicle.companyLogo ? (
            <Image
              width={40}
              height={40}
              src={vehicle.companyLogo}
              alt="Company Logo"
              className="profile-icon"
            />
          ) : (
            <img
              src={vehicle.companyLogo} // Fallback for logo
              alt="Company Logo"
              width={40}
              height={40}
              className="profile-icon"
            />
          )}
          <span>{vehicle.brandName}</span>
        </div>
      </Link>

      {/* card bottom */}
      <div className="card-bottom">
        <Link href={`/${state}/${category}/${vehicle.vehicleId}`}>
          {/* title */}
          <div className="model-name">{vehicle.model}</div>

          {/* vehicle specs grid */}
          <div className="specs-grid">
            {Object.entries(vehicle.vehicleSpecs).map(([key, spec]) => {
              return (
                <div key={key} className="spec">
                  {/* Using the formatted spec name to dynamically fetch the icon */}
                  <img
                    src={`${baseAssetsUrl}/icons/vehicle-specifications/${category}/${formatKeyForIcon(
                      key
                    )}.svg`}
                    alt={`${spec.name} icon`}
                    className="spec-icon"
                  />
                  <div className="each-spec-value">{spec.name || 'N/A'}</div>
                </div>
              )
            })}
          </div>

          {/* location and price */}
          <div className="location-box">
            <div className="location">
              <IoLocationOutline size={18} />{' '}
              <span className="state">{vehicle.state || 'N/A'}</span>
            </div>
            {rentalPeriod && (
              <div className="price">
                <span>{rentalPeriod.details.rentInAED || 'N/A'} AED</span> /{' '}
                {rentalPeriod.label}
              </div>
            )}
          </div>
        </Link>
        <div className="bottom-box">
          <Link
            href={`/${state}/${category}/${vehicle.vehicleId}`}
            className="rent-now-btn"
          >
            RENT NOW
            <span>Available now for chat</span>
          </Link>
          <ContactIcons
            vehicleId={vehicle.vehicleId}
            whatsappUrl={whatsappUrl}
            email={vehicle.email}
            phoneNumber={formattedPhoneNumber}
          />
        </div>
      </div>
    </div>
  )
}

export default MainCard
