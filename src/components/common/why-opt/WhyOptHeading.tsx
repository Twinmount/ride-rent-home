'use client'

import { useAppContext } from '@/context/AppContext'

export default function WhyOptHeading() {
  const { selectedLocation } = useAppContext()
  return (
    <h2>
      Why Opt RIDE.RENT When Looking for Cars for Rent in{' '}
      {selectedLocation.stateName} ?
    </h2>
  )
}
