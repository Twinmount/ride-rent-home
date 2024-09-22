import './MobileProfileCard.scss'

import { MdOutlineExpandCircleDown, MdVerifiedUser } from 'react-icons/md'
import { SiTicktick } from 'react-icons/si'
import { useState } from 'react'
import ProfileSpecification from '@/components/root/vehicle details/profile-specifications/ProfileSpecification'
import { Company, RentalDetails } from '@/types/vehicle-details-types'
import ContactIcons from '@/components/common/contact-icons/ContactIcons'
import { formatPhoneNumber } from '@/helpers'

type MobileProfileCardProps = {
  company: Company
  rentalDetails: RentalDetails
  vehicleId: string
}

const MobileProfileCard = ({
  company,
  rentalDetails,
  vehicleId,
}: MobileProfileCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Toggle function
  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  // Mouse leave toggle function
  const handleMouseLeave = () => {
    if (!isExpanded) return
    setIsExpanded(false)
  }

  // Handle case where contactDetails is null
  const contactDetails = company?.contactDetails

  const formattedPhoneNumber =
    contactDetails?.countryCode && contactDetails.phone
      ? formatPhoneNumber(contactDetails?.countryCode, contactDetails.phone)
      : null

  const message =
    'Hello, I would like to connect with you regarding the vehicle listed on Ride.Rent.'
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = contactDetails
    ? `https://wa.me/${contactDetails.whatsappCountryCode}${contactDetails.whatsappPhone}?text=${encodedMessage}`
    : null // Handle null WhatsApp details

  return (
    <div
      onMouseLeave={handleMouseLeave}
      className={`mobile-profile-card ${isExpanded ? 'expanded-view' : ''}`}
    >
      <div className="profile-heading top-heading">
        <h2 className="custom-heading mobile-profile-heading">
          Listing Owner Details{' '}
          {(!company.companyName || !company.companyProfile) && (
            <span className="disabled-text">&#40;Profile Disabled&#41;</span>
          )}
        </h2>
        <button className="expand" onClick={handleToggle}>
          {isExpanded ? 'show less' : 'show more'}{' '}
          <MdOutlineExpandCircleDown className="icon" />
        </button>
      </div>
      {/* profile */}
      <div className="top">
        {/* left */}
        <div className="profile-details">
          <div
            className={` ${
              company.companyProfile ? '' : 'blurred-profile'
            } profile`}
          >
            {/* Placeholder image or replace with actual company logo if available */}
            <img
              src={company.companyProfile || '/assets/img/blur-profile.webp'}
              alt={
                company?.companyName
                  ? `${company.companyName} logo`
                  : 'Company logo'
              }
              loading="lazy"
              className={'company-profile'}
              draggable={false}
            />
          </div>
          <div className="info">
            <p
              className={`${
                company.companyName ? '' : 'blurred-text'
              } company-name`}
            >
              {company.companyName || 'Company Disabled'}
            </p>
            {/* Assuming verification logic based on specs */}

            <div className="verified">
              <MdVerifiedUser className="icon" />
              <span>Verified Vendor</span>
            </div>
          </div>
        </div>

        {/* rent now button */}
        <div className="profile-right">
          <div className="contact-container">
            <div className="rent-now-btn">
              RENT NOW
              <span>Available now for chat</span>
            </div>
            <ContactIcons
              vehicleId={vehicleId}
              whatsappUrl={whatsappUrl}
              email={contactDetails?.email || null} // Handle null email
              phoneNumber={formattedPhoneNumber} // Handle null phone number
            />
          </div>
        </div>
      </div>

      {/* Specifications */}
      <ProfileSpecification
        specs={company.companySpecs}
        rentalDetails={rentalDetails}
      />

      {/* Availability */}
      <div className="availability">
        <SiTicktick className="icon" />
        <p>
          Availability <span>Verified</span>
        </p>
      </div>
    </div>
  )
}

export default MobileProfileCard
