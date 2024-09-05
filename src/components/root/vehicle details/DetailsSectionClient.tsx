'use client'

import MobileProfileCard from '@/components/card/mobile-profile-card/MobileProfileCard'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { Company, RentalDetails } from '@/types/vehicle-details-types'

import { useRef } from 'react'

type DetailsSectionClientProps = {
  children: React.ReactNode
  company: Company
  rentalDetails: RentalDetails
}

const DetailsSectionClient = ({
  children,
  company,
  rentalDetails,
}: DetailsSectionClientProps) => {
  const detailsSectionRef = useRef(null)
  const isInViewPort = useIntersectionObserver(detailsSectionRef)

  return (
    <div ref={detailsSectionRef}>
      {children}
      {isInViewPort && (
        <MobileProfileCard company={company} rentalDetails={rentalDetails} />
      )}
    </div>
  )
}

export default DetailsSectionClient
