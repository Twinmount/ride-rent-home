import './MobileProfileCard.scss'

import { MdOutlineExpandCircleDown, MdVerifiedUser } from 'react-icons/md'
import { FaWhatsappSquare } from 'react-icons/fa'
import { ImMail } from 'react-icons/im'
import { SiTicktick } from 'react-icons/si'
import { useState } from 'react'
import ProfileSpecification from '@/components/root/vehicle details/profile-specifications/ProfileSpecification'
import Phone from '@/components/common/phone/Phone'
import { Company, RentalDetails } from '@/types/vehicle-details-types'

type MobileProfileCardProps = {
  company: Company
  rentalDetails: RentalDetails
}

const MobileProfileCard = ({
  company,
  rentalDetails,
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

  const message =
    'Hello, I would like to connect with you regarding the vehicle listed on Ride.Rent.'
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${company?.contactDetails?.whatsappCountryCode}${company.contactDetails.whatsappPhone}?text=${encodedMessage}`

  return (
    <div
      onMouseLeave={handleMouseLeave}
      className={`mobile-profile-card ${isExpanded ? 'expanded-view' : ''}`}
    >
      <div className="profile-heading top-heading">
        <h2 className="custom-heading">Listing Owner Details</h2>
        <button className="expand" onClick={handleToggle}>
          {isExpanded ? 'show less' : 'show more'}{' '}
          <MdOutlineExpandCircleDown className="icon" />
        </button>
      </div>
      {/* profile */}
      <div className="top">
        {/* left */}
        <div className="profile-details">
          <div className="profile">
            {/* Placeholder image or replace with actual company logo if available */}
            <img
              src={company.companyProfile}
              alt={`${company.companyName} logo`}
              loading="lazy"
            />
          </div>
          <div className="info">
            <p>{company.companyName}</p>
            {/* Assuming verification logic based on specs */}
            {company.companySpecs.isFiatCurrencyAccepted && (
              <div className="verified">
                <MdVerifiedUser className="icon" />
                <span>Verified Vendor</span>
              </div>
            )}
          </div>
        </div>

        {/* rent now button */}
        <div className="profile-right">
          <div className="contact-container">
            <div className="rent-now-btn">
              RENT NOW
              <span>Available now for chat</span>
            </div>
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
                href={`mailto:${company.contactDetails.email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ImMail className="icon mail" />
              </a>

              {/* phone icon */}
              <Phone phoneNumber={company.contactDetails.phone} />
            </div>
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
