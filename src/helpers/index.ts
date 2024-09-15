import qs from 'query-string'
import { CategoryType, RemoveUrlQueryParams, UrlQueryParams } from '@/types'

// to form url params key/value
export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params)

  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

// to remove url params key
export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params)

  keysToRemove.forEach((key) => {
    delete currentUrl[key]
  })

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

export const sortCategories = (categories: CategoryType[]): CategoryType[] => {
  const order = [
    'cars',
    'sports-cars',
    'motorcycles',
    'sports-bikes',
    'bicycles',
    'buses',
    'leisure-boats',
    'yachts',
    'vans',
    'buggies',
    'charters',
  ]

  return categories.sort((a, b) => {
    return order.indexOf(a.value) - order.indexOf(b.value)
  })
}

// Helper function to format the key to match icon naming convention
export const formatKeyForIcon = (key: string) => {
  return key.toLowerCase().replace(/\s+/g, '-')
}

// Helper function to format phone numbers
export const formatPhoneNumber = (countryCode: string, phoneNumber: string) => {
  return `+${countryCode} ${phoneNumber}`
}

// change to singular
export const singularizeType = (type: string) => {
  if (type.toLowerCase() === 'buses') {
    return 'Bus'
  } else if (type.toLowerCase() === 'buggies') {
    return 'Buggy'
  }
  return type.endsWith('s') ? type.slice(0, -1) : type
}

/**
 * Converts a value back into its corresponding label.
 *
 * @param value - The value string in lowercase with hyphens.
 * @returns The formatted label string.
 */
export function convertToLabel(value: string): string {
  if (!value) {
    return '' // Return an empty string if value is undefined, null, or an empty string
  }

  return value
    .split('-') // Split the value by hyphen
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' ') // Join the words back with spaces
}
