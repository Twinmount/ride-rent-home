'use client'

import { useAppContext } from '@/context/AppContext'

export default function DocumentsHeading() {
  const { selectedLocation } = useAppContext()
  return (
    <h2>
      Ride.Rent is getting you the best cars for rental in{' '}
      {selectedLocation.stateName}
    </h2>
  )
}
