import {
  FetchBrandsResponse,
  FetchCategoriesResponse,
  FetchCitiesResponse,
  FetchLinksResponse,
  FetchStatesResponse,
  FetchTypesResponse,
} from '@/types'
import { handleError } from '../utils'

export const fetchStates = async (): Promise<
  FetchStatesResponse | undefined
> => {
  try {
    const response = await fetch(`/api/states`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch states data')
    }
    const { data } = await response.json()

    return data
  } catch (error) {
    handleError(error)
    return undefined
  }
}

export const fetchCategories = async (): Promise<
  FetchCategoriesResponse | undefined
> => {
  try {
    const response = await fetch(`/api/categories`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch categories data')
    }
    const { data } = await response.json()

    return data
  } catch (error) {
    handleError(error)
    return undefined
  }
}

// fetch all cities
export const fetchAllCities = async (
  stateId: string
): Promise<FetchCitiesResponse> => {
  try {
    const response = await fetch(`/api/cities/${stateId}`)

    if (!response.ok) {
      throw new Error('Failed to fetch cities')
    }
    const { data } = await response.json()

    return data
  } catch (error) {
    console.error('Error fetching cities:', error)
    throw error
  }
}

// fetch vehicle types (e.g., Luxury, SUVs) by vehicle category id
export const fetchVehicleTypesById = async (
  vehicleCategoryId: string
): Promise<FetchTypesResponse | undefined> => {
  try {
    const response = await fetch(`/api/vehicle-types/id/${vehicleCategoryId}`, {
      method: 'GET',
    })

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(
        `Failed to fetch vehicle types. Status: ${response.status}`
      )
    }

    const { data } = await response.json()

    return data
  } catch (error) {
    console.error('Error in fetchVehicleTypes:', error)
    handleError(error)
    return undefined
  }
}
// fetch vehicle types (e.g., Luxury, SUVs) by vehicle category value
export const fetchVehicleTypesByValue = async (
  vehicleCategoryValue: string
): Promise<FetchTypesResponse | undefined> => {
  try {
    const response = await fetch(
      `/api/vehicle-types/value/${vehicleCategoryValue}`,
      {
        method: 'GET',
      }
    )

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(
        `Failed to fetch vehicle types. Status: ${response.status}`
      )
    }

    const { data } = await response.json()

    return data
  } catch (error) {
    console.error('Error in fetchVehicleTypes:', error)
    handleError(error)
    return undefined
  }
}

// fetch vehicle brand by vehicle category id and search term
export const fetchVehicleBrandsById = async (
  vehicleCategoryId: string,
  searchTerm: string
): Promise<FetchBrandsResponse | undefined> => {
  try {
    const response = await fetch(
      `/api/vehicle-brands/id/${vehicleCategoryId}/${searchTerm}`,
      {
        method: 'GET',
      }
    )

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(
        `Failed to fetch vehicle types. Status: ${response.status}`
      )
    }

    const { data } = await response.json()

    return data
  } catch (error) {
    console.error('Error in fetchVehicleTypes:', error)
    handleError(error)
    return undefined
  }
}
// fetch vehicle brand by vehicle category value and search term
export const fetchVehicleBrandsByValue = async (
  vehicleCategory: string,
  searchTerm: string
): Promise<FetchBrandsResponse | undefined> => {
  try {
    const response = await fetch(
      `/api/vehicle-brands/value/${vehicleCategory}/${searchTerm}`,
      {
        method: 'GET',
      }
    )

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(
        `Failed to fetch vehicle types. Status: ${response.status}`
      )
    }

    const { data } = await response.json()

    return data
  } catch (error) {
    console.error('Error in fetchVehicleTypes:', error)
    handleError(error)
    return undefined
  }
}

// fetch quick links by state value
export const fetchQuickLinksByValue = async (
  stateValue: string
): Promise<FetchLinksResponse | undefined> => {
  try {
    const response = await fetch(`/api/quick-links/value/${stateValue}`, {
      method: 'GET',
    })

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(
        `Failed to fetch vehicle types. Status: ${response.status}`
      )
    }

    const { data } = await response.json()

    return data
  } catch (error) {
    console.error('Error in fetchVehicleTypes:', error)
    handleError(error)
    return undefined
  }
}
