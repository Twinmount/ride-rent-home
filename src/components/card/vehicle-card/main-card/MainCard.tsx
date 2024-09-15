import './MainCard.scss'
import { FaWhatsappSquare } from 'react-icons/fa'
import { ImMail } from 'react-icons/im'
import Link from 'next/link'
import Image from 'next/image'
import { VehicleCardType } from '@/types/vehicle-types'
import { StateCategoryProps } from '@/types'
import { IoLocationOutline } from 'react-icons/io5'
import Phone from '@/components/common/phone/Phone'
import { formatKeyForIcon, formatPhoneNumber } from '@/helpers'

type MainCardProps = {
  vehicle: VehicleCardType
} & StateCategoryProps

const MainCard = ({ vehicle, state, category }: MainCardProps) => {
  const formattedPhoneNumber = formatPhoneNumber(
    vehicle.countryCode,
    vehicle.phoneNumber
  )
  const message = `Hello, I am interested in the ${vehicle.model}. Could you please provide more details?`
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${vehicle.countryCode}${vehicle.phoneNumber}?text=${encodedMessage}`

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
          <Image
            width={300}
            height={300}
            src={vehicle.thumbnail}
            alt={vehicle.model}
            className="car-image"
          />

          <Image
            width={40}
            height={40}
            src={vehicle.companyLogo}
            alt="profile"
            className="profile-icon"
          />
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
          <div className="icons">
            <a
              href={whatsappUrl}
              aria-label="whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsappSquare className="icon whatsapp" />
            </a>
            <a
              href={`mailto:${vehicle.email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ImMail className="icon mail" />
            </a>

            {/* Pass the formatted phone number to the Phone component */}
            <Phone phoneNumber={formattedPhoneNumber} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainCard
