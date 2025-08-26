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
