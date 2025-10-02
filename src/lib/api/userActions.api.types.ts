export interface Vehicle {
  vehicleId: string;
  vehicleCode: string;
  model: string;
  thumbnail: string;
  companyLogo: string;
  companyName: string;
  companyShortId: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
  };
  rentalDetails: {
    [key: string]: {
      enabled: boolean;
      rentInAED: number;
    };
  };
  specifications?: {
    [key: string]: any;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UserAction {
  id: string;
  userId: string;
  vehicleId: string;
  actionType: 'enquired' | 'saved' | 'viewed';
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
}

export interface UserVehiclesResponse {
  status: string;
  result: {
    data: UserAction[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
  };
  statusCode: number;
}

export interface UserVehiclesRequest {
  userId: string;
  actionType: 'enquired' | 'saved' | 'viewed';
  page?: number;
  limit?: number;
}

export interface EnquiredVehicle extends UserAction {
  actionType: 'enquired';
  enquiryDetails?: {
    message?: string;
    contactPreference?: 'phone' | 'email' | 'whatsapp';
    status?: 'pending' | 'contacted' | 'resolved';
  };
}

export interface SavedVehicle extends UserAction {
  actionType: 'saved';
  savedAt: string;
}

export interface ViewedVehicle extends UserAction {
  actionType: 'viewed';
  viewDuration?: number;
  lastViewedAt: string;
}
