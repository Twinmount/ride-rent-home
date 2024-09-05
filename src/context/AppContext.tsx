'use client'

import {
  AppContextType,
  CategoryType,
  FiltersType,
  LocationType,
} from '@/types/contextTypes'
import { createContext, useContext, useState, ReactNode } from 'react'

const AppContext = createContext<AppContextType | null>(null)

const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

type AppProviderProps = {
  children: ReactNode
}

const AppProvider = ({ children }: AppProviderProps) => {
  // Vehicle type
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>({
    categoryId: '',
    name: '',
    value: '',
  })

  // Selected location
  const [selectedLocation, setSelectedLocation] = useState<LocationType>({
    stateId: '',
    stateName: '',
    stateValue: '',
    countryId: '',
    subHeading: '',
    metaTitle: '',
    metaDescription: '',
    stateImage: null,
  })

  // Global state for listing page filter
  const [selectedFilters, setSelectedFilters] = useState<FiltersType>({
    modelYear: [],
    vehicleCategory: selectedCategory.value,
    vehicleTypes: [],
    carSubTypes: [],
    seats: [],
    paymentMode: [],
    transmission: [],
    fuelType: [],
    brand: [],
    color: [],
  })

  return (
    <AppContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        selectedLocation,
        setSelectedLocation,
        selectedFilters,
        setSelectedFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export { useAppContext, AppProvider }
