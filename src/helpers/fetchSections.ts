import { API } from "@/utils/API";

interface BestOfferParams {
  rentalType: string;
  originalPrice: number;
  maxPrice: number;
  displayName: string;
  minHours?: number;
}

// Calculate best offer parameters based on available rental types
export function getBestOfferParams(rentalDetails: any): BestOfferParams | null {
  // Priority: hour → day → week → month (most granular first)
  const rentalTypes = [
    { key: 'hour', name: 'Hourly' },
    { key: 'day', name: 'Daily' },
    { key: 'week', name: 'Weekly' },
    { key: 'month', name: 'Monthly' }
  ];
  
  for (const type of rentalTypes) {
    const rental = rentalDetails[type.key];
    
    if (rental?.enabled && rental?.rentInAED) {
      const price = parseFloat(rental.rentInAED);
      
      if (!isNaN(price) && price > 0) {
        const result: BestOfferParams = {
          rentalType: type.key,
          originalPrice: price,
          maxPrice: Math.floor(price * 0.7), // 30% discount
          displayName: type.name
        };
        
        // Add minHours for hourly rentals
        if (type.key === 'hour' && rental.minBookingHours) {
          const minHours = parseFloat(rental.minBookingHours);
          if (!isNaN(minHours) && minHours > 0) {
            result.minHours = minHours;
          }
        }
        
        return result;
      }
    }
  }
  
  return null;
}

// Fetch data for specific similar cars section
export async function fetchSectionData(
  sectionType: string,
  state: string,
  category: string,
  vehicleCode: string,
  country: string,
  currentVehicle?: any
) {
  const baseParams = new URLSearchParams({
    page: '1',
    limit: '6',
    state: state,
    category: category,
    excludeVehicleCode: vehicleCode,
    sectionType: sectionType,
  });

  // Add section-specific parameters
  switch (sectionType) {
    case 'BEST_OFFERS':
      if (currentVehicle?.rentalDetails) {
        const bestOfferParams = getBestOfferParams(currentVehicle.rentalDetails);
        
        if (bestOfferParams) {
          baseParams.append('rentalType', bestOfferParams.rentalType);
          baseParams.append('maxPrice', bestOfferParams.maxPrice.toString());
          
          if (bestOfferParams.rentalType === 'hour' && bestOfferParams.minHours) {
            baseParams.append('minHours', bestOfferParams.minHours.toString());
          }
        } else {
          baseParams.append('maxPrice', '0');
        }
      } else {
        baseParams.append('maxPrice', '0');
      }
      break;
      
    case 'MORE_FROM_BRAND':
      if (currentVehicle?.brandValue) {
        baseParams.append('brandValue', currentVehicle.brandValue);
      } else {
        baseParams.append('brandValue', 'nonexistent-brand');
      }
      break;
      
    case 'NEWLY_ARRIVED':
      // No additional parameters needed
      break;
  }

  return await API({
    path: `/vehicle/similar-cars?${baseParams.toString()}`,
    options: {
      method: 'GET',
      cache: 'no-cache',
    },
    country,
  });
}
