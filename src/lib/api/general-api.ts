import { FetchVehicleCardsResponse } from '@/types/vehicle-types'

// Function to fetch vehicles based on filters using a POST request
export const FetchVehicleByFilters = async (
  query: string
): Promise<FetchVehicleCardsResponse> => {
  // Parse the query string to get filter values
  const params = new URLSearchParams(query)

  // Utility function to safely parse parameter values
  const getParamValue = (key: string, defaultValue: string = ''): string => {
    const value = params.get(key)
    return value !== null ? value : defaultValue
  }

  const getParamArray = (key: string): string[] => {
    const value = params.get(key)
    return value ? value.split(',') : []
  }

  // Build the payload for the POST request
  const payload: Record<string, any> = {
    page: getParamValue('page', '1'), // Ensure it's a string
    limit: getParamValue('limit', '10'), // Ensure it's a string
    sortOrder: 'DESC', // You can dynamically set this if needed
    state: getParamValue('state', 'dubai'), // Default state if not specified
  }

  // Add optional fields only if they are non-empty
  const optionalFields = {
    category: getParamValue('category'),
    brand: getParamArray('brand'),
    color: getParamArray('color'),
    fuelType: getParamArray('fuelType'),
    modelYear: getParamValue('modelYear'),
    seats: getParamValue('seats'),
    transmission: getParamArray('transmission'),
    vehicleTypes: getParamArray('vehicleTypes'),
    filter: getParamValue('filter'),
  }

  Object.entries(optionalFields).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      payload[key] = value
    } else if (typeof value === 'string' && value !== '') {
      payload[key] = value
    }
  })

  // Send the POST request to the API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/vehicle/filter`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch vehicles')
  }

  const data: FetchVehicleCardsResponse = await response.json()

  return data // The data now adheres to the FetchVehicleCardsResponse type
}
