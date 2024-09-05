'use client'

import { useAppContext } from '@/context/AppContext'

export default function FeatureLocation() {
  const { selectedLocation } = useAppContext()
  return (
    <h2>
      Enjoy ease and peace of mind when renting a car in{' '}
      {selectedLocation.stateName}
    </h2>
  )
}
