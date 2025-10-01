export function getSectionConfig(
  sectionType: string, 
  formattedCategory: string,
  country: string,
  state: string,
  category: string,
  sectionData?: {
    brandValue?: string;
    rentalType?: string;
    minPrice?: number;
    maxPrice?: number;
  }
) {
  const baseUrl = `/${country}/${state}/listing/${category}`;
  
  switch (sectionType) {
    case 'BEST_OFFERS':
      // URL: /{country}/{state}/listing/{category}?period={type}&price={min}-{max}
      const period = sectionData?.rentalType || 'day';
      const minPrice = sectionData?.minPrice || 0;
      const maxPrice = sectionData?.maxPrice || 1000;
      
      return {
        title: `Best value offers`,
        description: `Explore more choices curated for both budget and style.`,
        url: `${baseUrl}?period=${period}&price=${minPrice}-${maxPrice}`,
      };
      
    case 'MORE_FROM_BRAND':
      // URL: /{country}/{state}/listing/{category}/brand/{brandValue}
      const brandValue = sectionData?.brandValue || '';
      
      return {
        title: `More from Brand`,
        description: `Explore more ${formattedCategory} from the same trusted brand.`,
        url: brandValue ? `${baseUrl}/brand/${brandValue}` : `${baseUrl}?filter=popular-models`
      };
      
    case 'NEWLY_ARRIVED':
      // URL: /{country}/{state}/listing/{category}?filter=latest-models
      return {
        title: `Newly Arrived`,
        description: `Experience the latest arrivals at the best rates`,
        url: `${baseUrl}?filter=latest-models`,
      };
      
    case 'SIMILAR_FALLBACK':
    default:
      // URL: /{country}/{state}/listing/{category}?filter=latest-models
      return {
        title: `Similar ${formattedCategory}`,
        description: `Check out more options you might like.`,
        url: `${baseUrl}?filter=latest-models`
      };
  }
}
