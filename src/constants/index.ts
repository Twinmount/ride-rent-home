// Generate model years in 5-year increments starting from the current year
export const modelYears = Array.from(
  { length: Math.ceil((new Date().getFullYear() - 1900) / 5) },
  (_, i) => {
    const startYear = new Date().getFullYear() - 5 * i
    const endYear = startYear - 4 > 1900 ? startYear - 4 : 1900
    return `${startYear}-${endYear}`
  }
)

// General seat count ranges
export const seats = ['1-2', '2-4', '4-6', '4-8', '8-20', '20-60']

// transmissions
export const transmissions = [
  { label: 'Automatic', value: 'automatic' },
  { label: 'Manual', value: 'manual' },
]

// fuel types
export const fuelTypes = [
  { label: 'Petrol', value: 'petrol' },
  { label: 'Electric', value: 'electric' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'Diesel', value: 'diesel' },
]

// colors
export const colors = [
  { label: 'Red', value: 'red' },
  { label: 'Blue', value: 'blue' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Black', value: 'black' },
  { label: 'Brown', value: 'brown' },
  { label: 'White', value: 'white' },
  { label: 'Silver', value: 'silver' },
  { label: 'Off White', value: 'off-white' },
  { label: 'Orange', value: 'orange' },
  { label: 'Gray', value: 'gray' },
  { label: 'Dark Gray', value: 'dark-gray' },
  { label: 'Green', value: 'green' },
  { label: 'Champagne Gold', value: 'champagne-gold' },
  { label: 'Light Green', value: 'light-green' },
  { label: 'Maroon', value: 'maroon' },
  { label: 'Bronze', value: 'bronze' },
  { label: 'Burgundy', value: 'burgundy' },
  { label: 'Purple', value: 'purple' },
  { label: 'Pink', value: 'pink' },
  { label: 'Matte Gray', value: 'matte-gray' },
  { label: 'Matte Black', value: 'matte-black' },
  { label: 'Matte Red', value: 'matte-red' },
  { label: 'Lemon Yellow', value: 'lemon-yellow' },
  { label: 'Turquoise', value: 'turquoise' },
  { label: 'Matte Blue', value: 'matte-blue' },
  { label: 'Sapphire Blue', value: 'sapphire-blue' },
  { label: 'Metallic Silver', value: 'metallic-silver' },
  { label: 'Metallic Red', value: 'metallic-red' },
  { label: 'Metallic Gray', value: 'metallic-gray' },
  { label: 'Beige', value: 'beige' },
  { label: 'Golden', value: 'golden' },
]
