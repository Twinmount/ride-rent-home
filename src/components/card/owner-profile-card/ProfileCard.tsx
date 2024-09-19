'use client'

import './ProfileCard.scss'
import { MdVerifiedUser } from 'react-icons/md'
import ProfileSpecification from '@/components/root/vehicle details/profile-specifications/ProfileSpecification'
import MotionDiv from '@/components/general/framer-motion/MotionDiv'
import { Company, RentalDetails } from '@/types/vehicle-details-types'
import ContactIcons from '@/components/common/contact-icons/ContactIcons'

type ProfileCardProps = {
  company: Company
  rentalDetails: RentalDetails
  vehicleId: string
}

const ProfileCard = ({
  company,
  rentalDetails,
  vehicleId,
}: ProfileCardProps) => {
  const contactDetails = company?.contactDetails
  const message =
    'Hello, I would like to connect with you regarding the vehicle listed on Ride.Rent.'
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = contactDetails
    ? `https://wa.me/${contactDetails.whatsappCountryCode}${contactDetails.whatsappPhone}?text=${encodedMessage}`
    : null

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

            <div className="verified">
              <MdVerifiedUser className="icon" />
              <span>Verified Vendor</span>
            </div>
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
          <ContactIcons
            vehicleId={vehicleId}
            whatsappUrl={whatsappUrl}
            email={contactDetails?.email || null} //  null email
            phoneNumber={contactDetails?.phone || null} //  null phone number
          />
        </div>
      </div>
    </MotionDiv>
  )
}

export default ProfileCard
