import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import qs from 'query-string'
import { removeKeysFromQuery } from '@/helpers'

interface FiltersType {
  modelYear: string
  category: string
  vehicleTypes: string[]
  seats: string
  transmission: string[]
  fuelType: string[]
  color: string[]
  brand: string[]
}

const useFilters = () => {
  // Local state for filter changes
  const [selectedFilters, setSelectedFilters] = useState<FiltersType>({
    modelYear: '',
    category: '',
    vehicleTypes: [],
    seats: '',
    transmission: [],
    fuelType: [],
    color: [],
    brand: [],
  })

  // Applied filters reflecting the URL parameters
  const [appliedFilters, setAppliedFilters] = useState<FiltersType>({
    modelYear: '',
    category: '',
    vehicleTypes: [],
    seats: '',
    transmission: [],
    fuelType: [],
    color: [],
    brand: [],
  })

  const searchParams = useSearchParams()
  const router = useRouter()

  // Initialize filters from URL parameters
  useEffect(() => {
    const params = qs.parse(searchParams.toString())

    const filtersFromParams: FiltersType = {
      modelYear: typeof params.modelYear === 'string' ? params.modelYear : '',
      category: typeof params.category === 'string' ? params.category : '',
      vehicleTypes:
        typeof params.vehicleTypes === 'string'
          ? params.vehicleTypes.split(',')
          : [],
      seats: typeof params.seats === 'string' ? params.seats : '',
      transmission:
        typeof params.transmission === 'string'
          ? params.transmission.split(',')
          : [],
      fuelType:
        typeof params.fuelType === 'string' ? params.fuelType.split(',') : [],
      color: typeof params.color === 'string' ? params.color.split(',') : [],
      brand: typeof params.brand === 'string' ? params.brand.split(',') : [],
    }

    setSelectedFilters(filtersFromParams)
    setAppliedFilters(filtersFromParams)
  }, [searchParams])

  const handleFilterChange = (filterName: keyof FiltersType, value: string) => {
    const updatedFilters = { ...selectedFilters }

    if (
      filterName === 'modelYear' ||
      filterName === 'category' ||
      filterName === 'seats'
    ) {
      // Single string filter
      updatedFilters[filterName] = value
    } else {
      // Multi-select filter logic
      const filterArray = updatedFilters[filterName] as string[]
      if (filterArray.includes(value)) {
        updatedFilters[filterName] = filterArray.filter(
          (v) => v !== value
        ) as string[]
      } else {
        updatedFilters[filterName] = [...filterArray, value] as string[]
      }
    }

    setSelectedFilters(updatedFilters)
  }

  const applyFilters = () => {
    // Apply changes and update the URL
    setAppliedFilters(selectedFilters)

    // Get the current URL params and merge with the selected filters
    const currentParams = qs.parse(searchParams.toString())

    // Merge the selected filters with the current params
    const updatedParams = {
      ...currentParams,
      ...selectedFilters,
    }

    // Filter out any empty values before updating the URL
    const nonEmptyFilters = Object.fromEntries(
      Object.entries(updatedParams).filter(
        ([_, value]) =>
          value !== '' && !(Array.isArray(value) && value.length === 0)
      )
    )

    // Update the URL parameters with non-empty values
    const queryParams = qs.stringify(nonEmptyFilters, { arrayFormat: 'comma' })
    const newUrl = `${window.location.pathname}?${queryParams}`
    router.push(newUrl, { scroll: false })
  }

  const resetFilters = () => {
    setSelectedFilters({
      modelYear: '',
      category: 'cars',
      vehicleTypes: [],
      seats: '',
      transmission: [],
      fuelType: [],
      color: [],
      brand: [],
    })

    // Reset the URL and applied filters
    setAppliedFilters({
      modelYear: '',
      category: 'cars',
      vehicleTypes: [],
      seats: '',
      transmission: [],
      fuelType: [],
      color: [],
      brand: [],
    })

    const newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: [
        'modelYear',
        'vehicleTypes',
        'seats',
        'transmission',
        'fuelType',
        'color',
        'brand',
      ],
    })

    router.push(newUrl, { scroll: false })
  }

  return {
    selectedFilters,
    appliedFilters,
    handleFilterChange,
    applyFilters,
    resetFilters,
  }
}

export default useFilters
