import './VerticalCard.scss'
import { FaWhatsappSquare } from 'react-icons/fa'
import { ImMail } from 'react-icons/im'
import { IoLocationOutline } from 'react-icons/io5'
import { FC } from 'react'
import { MotionDivElm } from '@/components/general/framer-motion/MotionElm'
import Phone from '@/components/common/phone/Phone'
import { VehicleCardType } from '@/types/vehicle-types'
import { formatKeyForIcon } from '@/helpers'
import Link from 'next/link'
import Image from 'next/image'

type VerticalCardProps = {
  vehicle: VehicleCardType
  category: string
  state: string
}

const VerticalCard: FC<VerticalCardProps> = ({ vehicle, category, state }) => {
  const formattedPhoneNumber = `${vehicle.countryCode}${vehicle.phoneNumber}`
  const message = `Hello, I am interested in the ${vehicle.model}. Could you please provide more details?`
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${formattedPhoneNumber}?text=${encodedMessage}`

  // Determine which rental period to display
  const rentalPeriod = vehicle.rentalDetails.day?.enabled
    ? { label: 'Day', details: vehicle.rentalDetails.day }
    : vehicle.rentalDetails.week?.enabled
    ? { label: 'Week', details: vehicle.rentalDetails.week }
    : vehicle.rentalDetails.month?.enabled
    ? { label: 'Month', details: vehicle.rentalDetails.month }
    : null

  // Base URL for fetching icons
  const baseAssetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL

  // link for the vehicle details page
  const vehicleDetailsLink = `/${state}/${category}/${vehicle.vehicleId}`

  return (
    <MotionDivElm
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: 'tween', duration: 0.3, delay: 0.1 }}
      viewport={{ once: true }}
      className="vertical-card-container slide-visible"
    >
      {/* card top */}
      <Link href={vehicleDetailsLink}>
        <div className="card-top">
          <div className="image-box">
            <Image
              src={vehicle.thumbnail}
              alt={vehicle.model}
              width={400}
              height={400}
              className="car-image"
            />
            <Image
              width={40}
              height={40}
              src={vehicle.companyLogo}
              alt="profile"
              className="profile-icon"
            />
            <span className="brand">{vehicle.brandName}</span>
          </div>
        </div>
      </Link>

      {/* card bottom */}
      <div className="card-bottom">
        <Link href={vehicleDetailsLink}>
          <div className="model-name">{vehicle.model}</div>
        </Link>

        {/* vehicle specs grid */}
        <Link href={vehicleDetailsLink}>
          <div className="specs-grid">
            {Object.entries(vehicle.vehicleSpecs).map(([key, spec]) => (
              <div key={key} className="spec">
                <img
                  src={`${baseAssetsUrl}/icons/vehicle-specifications/${category}/${formatKeyForIcon(
                    key
                  )}.svg`}
                  alt={`${spec.name} icon`}
                  className="spec-icon"
                />
                {spec.value || 'N/A'}
              </div>
            ))}
          </div>
        </Link>

        {/* location and price */}
        <Link href={vehicleDetailsLink}>
          <div className="location-box">
            <div className="location">
              <IoLocationOutline size={17} />{' '}
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
          <Link href={vehicleDetailsLink}>
            <div className="rent-now-btn">
              RENT NOW
              <span>Available now for chat</span>
            </div>
          </Link>

          {/* Icons section, excluded from the Link */}
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
    </MotionDivElm>
  )
}

export default VerticalCard
