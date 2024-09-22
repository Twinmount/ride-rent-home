import './HorizontalCard.scss'
import { IoLocationOutline } from 'react-icons/io5'
import Specifications from '../../../root/listing/specifications/Specifications'
import { FC } from 'react'
import { MotionDivElm } from '@/components/general/framer-motion/MotionElm'
import Image from 'next/image'
import { VehicleCardType } from '@/types/vehicle-types'
import { formatKeyForIcon, formatPhoneNumber } from '@/helpers'
import Link from 'next/link'
import ContactIcons from '@/components/common/contact-icons/ContactIcons'

type HorizontalCardProps = {
  vehicle: VehicleCardType
  category: string
  state: string
}

const HorizontalCard: FC<HorizontalCardProps> = ({
  vehicle,
  category,
  state,
}) => {
  const formattedPhoneNumber =
    vehicle.phoneNumber && vehicle.countryCode
      ? formatPhoneNumber(vehicle.countryCode, vehicle.phoneNumber)
      : null

  const message = `Hello, I am interested in the ${vehicle.model}. Could you please provide more details?`
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = vehicle.whatsappPhone
    ? `https://wa.me/${vehicle.whatsappCountryCode}${vehicle.whatsappPhone}?text=${encodedMessage}`
    : null

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

  // Link for the vehicle details page
  const vehicleDetailsLink = `/${state}/${category}/${vehicle.vehicleId}`

  return (
    <MotionDivElm
      initial={{ scale: 0.95, opacity: 0, y: 15 }}
      whileInView={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'tween', duration: 0.3, delay: 0.1 }}
      viewport={{ once: true }}
      className="horizontal-card-container slide-visible"
    >
      {/* card left */}
      <div className="card-left">
        <Link href={vehicleDetailsLink} className="image-box">
          {/* Thumbnail Image */}
          {vehicle.thumbnail ? (
            <Image
              src={vehicle.thumbnail}
              alt={vehicle.model || 'Vehicle Image'}
              width={350}
              height={350}
              className="vehicle-image"
            />
          ) : (
            <img
              src={vehicle.thumbnail} // Fallback or invalid URL handling
              alt="Vehicle Image"
              className="vehicle-image"
            />
          )}
          <span className="brand">{vehicle.brandName}</span>
        </Link>
      </div>

      {/* card right */}
      <div className="card-right">
        {/* title and features */}
        <Link href={vehicleDetailsLink} className="right-top-container">
          {vehicle.model}
        </Link>

        {/* Dynamic Vehicle specs */}
        <Link href={vehicleDetailsLink} className="vehicle-specs">
          {Object.entries(vehicle.vehicleSpecs).map(([key, spec]) => (
            <div key={key} className="spec">
              <img
                src={`${baseAssetsUrl}/icons/vehicle-specifications/${category}/${formatKeyForIcon(
                  key
                )}.svg`}
                alt={`${spec.name} icon`}
                className="spec-icon "
              />

              <div className="each-spec-value">{spec.name || 'N/A'}</div>
            </div>
          ))}
        </Link>

        {/* Specifications */}
        <Link href={vehicleDetailsLink}>
          <Specifications />
        </Link>

        <div className="bottom-box">
          <div className="bottom-left">
            <Link href={vehicleDetailsLink} className="profile">
              {/* Company Logo */}
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
                  src={'/assets/img/blur-profile.webp'} //
                  alt="Company Logo"
                  className="profile-icon"
                />
              )}
            </Link>

            <Link href={vehicleDetailsLink} className="location">
              <IoLocationOutline size={17} />{' '}
              <span className="state">{vehicle.state || 'N/A'}</span>
            </Link>
          </div>

          {/* price */}
          {rentalPeriod && (
            <div className="price">
              <span>{rentalPeriod.details.rentInAED || 'N/A'} AED</span> /{' '}
              {rentalPeriod.label}
            </div>
          )}

          <div className="bottom-right">
            {/* Rent Now button */}
            <Link href={vehicleDetailsLink} className="rent-now-btn">
              RENT NOW
              <span>Available now for chat</span>
            </Link>

            {/* Icons for WhatsApp and email */}
            <ContactIcons
              vehicleId={vehicle.vehicleId}
              whatsappUrl={whatsappUrl}
              email={vehicle.email}
              phoneNumber={formattedPhoneNumber}
            />
          </div>
        </div>
      </div>
    </MotionDivElm>
  )
}

export default HorizontalCard
