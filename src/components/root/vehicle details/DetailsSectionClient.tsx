'use client'

import MobileProfileCard from '@/components/card/mobile-profile-card/MobileProfileCard'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { sendPortfolioVisit } from '@/lib/api/general-api'
import { Company, RentalDetails } from '@/types/vehicle-details-types'
import { useQuery } from '@tanstack/react-query'

import { useEffect, useRef } from 'react'

type DetailsSectionClientProps = {
  children: React.ReactNode
  company: Company
  rentalDetails: RentalDetails
  vehicleId: string
}

const DetailsSectionClient = ({
  children,
  company,
  rentalDetails,
  vehicleId,
}: DetailsSectionClientProps) => {
  const detailsSectionRef = useRef(null)
  const isInViewPort = useIntersectionObserver(detailsSectionRef)

  useQuery({
    queryKey: ['portfolioVisit', vehicleId],
    queryFn: () => sendPortfolioVisit(vehicleId),
    staleTime: 600000, // 10 minutes in milliseconds
    enabled: !!vehicleId, // Ensures the query runs only when vehicleId is available
  })

  return (
    <div ref={detailsSectionRef}>
      {children}
      {isInViewPort && (
        <MobileProfileCard
          company={company}
          rentalDetails={rentalDetails}
          vehicleId={vehicleId}
        />
      )}
    </div>
  )
}

export default DetailsSectionClient
