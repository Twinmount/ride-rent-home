import './ProfileCard.scss'
import { MdVerifiedUser } from 'react-icons/md'
import { FaWhatsappSquare } from 'react-icons/fa'
import { ImMail } from 'react-icons/im'

import ProfileSpecification from '@/components/root/vehicle details/profile-specifications/ProfileSpecification'
import Phone from '@/components/common/phone/Phone'
import MotionDiv from '@/components/general/framer-motion/MotionDiv'
import { Company, RentalDetails } from '@/types/vehicle-details-types'

type ProfileCardProps = {
  company: Company
  rentalDetails: RentalDetails
}

const ProfileCard = ({ company, rentalDetails }: ProfileCardProps) => {
  const message =
    'Hello, I would like to connect with you regarding the vehicle listed on Ride.Rent.'
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${company?.contactDetails?.whatsappCountryCode}${company.contactDetails.whatsappPhone}?text=${encodedMessage}`

  return (
    <MotionDiv className="profile-card">
      <div className="profile-heading">
        <h2 className="custom-heading">Listing Owner Details</h2>
      </div>

      {/* profile */}
      <div className="top">
        <div className="profile-details">
          <div className="profile">
            {/* Placeholder image as companyLogo is not available in Company type */}
            <img
              src={company.companyProfile}
              alt={`${company.companyName} logo`}
              loading="lazy"
            />
          </div>
          <div>
            <p>{company.companyName}</p>
            {company.companySpecs.isFiatCurrencyAccepted && (
              <div className="verified">
                <MdVerifiedUser className="icon" />
                <span>Verified Vendor</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Specifications */}
      <ProfileSpecification
        specs={company.companySpecs}
        rentalDetails={rentalDetails}
      />

      {/* Contact and action buttons */}
      <div className="bottom">
        <div className="bottom-box">
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
    </MotionDiv>
  )
}

export default ProfileCard
