export type Brand = {
  id: string
  label: string
  value: string
}

export type State = {
  id: string
  label: string
  value: string
}

export type City = {
  id: string
  label: string
  value: string
}

export type VehiclePhoto = string

export type Spec = {
  name: string
  value: string
  selected: boolean
  hoverInfo?: string
}

export type Specs = Record<string, Spec>

export type Feature = {
  name: string
  value: string
  selected: boolean
}

export type Features = Record<string, Feature[]>

export type RentalPeriod = {
  enabled: boolean
  rentInAED: string
  mileageLimit: string
}

export type RentalDetails = {
  day: RentalPeriod
  week: RentalPeriod
  month: RentalPeriod
}

export type ContactDetails = {
  email: string
  phone: string
  countryCode: string
  whatsappPhone: string
  whatsappCountryCode: string
}

export type CompanySpecs = {
  isCryptoAccepted: boolean
  isSpotDeliverySupported: boolean
}

export type Company = {
  companyProfile: string | null
  companyName: string | null
  companySpecs: CompanySpecs
  contactDetails: ContactDetails | null
}

export type VehicleDetailsResponse = {
  status: string
  result: {
    brand: Brand
    modelName: string
    subTitle: string
    state: State
    isLease: boolean //isLease
    cities: City[]
    vehiclePhotos: VehiclePhoto[]
    specs: Specs
    features: Features
    rentalDetails: RentalDetails
    company: Company
    description: string
    isAvailableForLease: boolean
    vehicleSpecification: string
  }
  statusCode: number
}
