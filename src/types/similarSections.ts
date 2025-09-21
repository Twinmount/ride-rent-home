export enum SimilarSectionType {
  BEST_OFFERS = 'BEST_OFFERS',
  MORE_FROM_BRAND = 'MORE_FROM_BRAND', 
  NEWLY_ARRIVED = 'NEWLY_ARRIVED'
}

export interface SimilarSectionRequest {
  sectionType: SimilarSectionType;
  state: string;
  category: string;
  vehicleCode: string;
  brandValue?: string;
  currentPrice?: number;
  rentalType?: 'hour' | 'day' | 'week' | 'month';
}
