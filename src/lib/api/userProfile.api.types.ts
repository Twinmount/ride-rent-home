export interface UserCarActionCounts {
  saved: number;
  viewed: number;
  enquired: number;
}

export interface UserCarActionCountsResponse {
  status: string;
  result: UserCarActionCounts;
  statusCode: number;
}

export interface UserRecentActivity {
  _id: string;
  activityType: 'SAVE' | 'VIEW' | 'ENQUIRY';
  userId: string;
  carId: string;
  vehicleName: string;
  brandName: string;
  activityDate: string;
  timeAgo: string;
  activityDescription: string;
  vehicleImageUrl: string;
}

export interface UserRecentActivitiesResponse {
  status: string;
  result: UserRecentActivity[];
  statusCode: number;
}
