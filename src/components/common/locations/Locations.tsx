'use client'

import './Locations.scss'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAllCities, fetchStates } from '@/lib/next-api/next-api'
import { StateType, CityType, StateCategoryProps } from '@/types'
import LocationsSkelton from '@/components/skelton/LocationsSkelton'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

const Locations = ({ state, category }: StateCategoryProps) => {
  const [selectedState, setSelectedState] = useState<StateType | null>(null)
  const [cities, setCities] = useState<CityType[]>([])
  const [showAllCities, setShowAllCities] = useState<boolean>(false)

  // Fetch states using useQuery
  const { data: statesData, isLoading: isStatesLoading } = useQuery({
    queryKey: ['states'],
    queryFn: fetchStates,
  })

  // Fetch cities based on selected state
  const { data: citiesData, isLoading: isCitiesLoading } = useQuery({
    queryKey: ['cities', selectedState?.stateId],
    queryFn: () => fetchAllCities(selectedState?.stateId as string),
    enabled: !!selectedState?.stateId && !isStatesLoading,
  })

  // Set the initial state when statesData is available
  useEffect(() => {
    if (statesData && statesData.result.length > 0) {
      const matchingState = statesData.result.find(
        (s: StateType) => s.stateValue === state
      )
      if (matchingState) {
        setSelectedState(matchingState)
      } else {
        setSelectedState(statesData.result[0]) // Set the first state as the default if no match
      }
    }
  }, [statesData, state]) // Ensure dependencies are stable and consistent

  // Update cities when citiesData is available
  useEffect(() => {
    if (!isCitiesLoading && citiesData && citiesData.result.length > 0) {
      setCities(citiesData.result)
    } else {
      setCities([])
    }
  }, [citiesData, isCitiesLoading])

  // Handle state change
  const handleStateChange = (state: StateType) => {
    setSelectedState(state)
    setShowAllCities(false) // Reset to show less cities when state changes
  }

  // Toggle show all or less cities
  const toggleShowAllCities = () => {
    setShowAllCities((prev) => !prev)
  }

  // Determine which cities to display
  const citiesToDisplay = showAllCities ? cities : cities.slice(0, 50)

  return (
    <section className="wrapper locations-section">
      <h3>Available Locations</h3>
      <p>Choose your state/city to rent</p>

      {/* Display States */}
      <div className="countries">
        {isStatesLoading ? (
          <LocationsSkelton count={8} />
        ) : (
          statesData?.result.map((state) => (
            <button
              key={state.stateId}
              onClick={() => handleStateChange(state)}
              className={`${
                selectedState?.stateId === state.stateId ? 'selected' : ''
              }`}
            >
              {state.stateName}
            </button>
          ))
        )}
      </div>

      {/* Display Cities */}
      <div className="flex flex-col items-center">
        <div className="cities">
          {isCitiesLoading ? (
            <LocationsSkelton count={50} />
          ) : (
            <div className="flex justify-center flex-wrap gap-2">
              {citiesToDisplay.map((city) => (
                <Link
                  href={`/${selectedState?.stateValue}/listing?category=${category}&city=${city.cityValue}`}
                  className="city"
                  key={city.cityId}
                >
                  {city.cityName}
                </Link>
              ))}
              {cities.length > 50 && (
                <button
                  onClick={toggleShowAllCities}
                  className="bg-black px-2 py-1 relative bottom-1 flex-center rounded-xl text-white mt-2"
                >
                  {showAllCities ? (
                    <>
                      Show Less <ChevronUp className="ml-2" size={16} />
                    </>
                  ) : (
                    <>
                      Show All <ChevronDown className="ml-2" size={16} />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Locations
