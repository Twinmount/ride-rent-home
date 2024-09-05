export type LocationType = {
  stateId: string
  stateName: string
  stateValue: string
  countryId?: string
  subHeading?: string
  metaTitle?: string
  metaDescription?: string
  stateImage?: any
}

// category type
export interface CategoryType {
  categoryId: string
  name: string
  value: string
}

export type FiltersType = {
  modelYear: string[]
  vehicleCategory: string
  vehicleTypes: string[]
  carSubTypes: string[]
  seats: string[]
  paymentMode: string[]
  transmission: string[]
  fuelType: string[]
  brand: string[]
  color: string[]
}

export type AppContextType = {
  selectedCategory: CategoryType
  setSelectedCategory: React.Dispatch<React.SetStateAction<CategoryType>>
  selectedLocation: LocationType
  setSelectedLocation: React.Dispatch<React.SetStateAction<LocationType>>
  selectedFilters: FiltersType
  setSelectedFilters: React.Dispatch<React.SetStateAction<FiltersType>>
}
