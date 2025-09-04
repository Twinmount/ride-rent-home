import axios from "axios";
import type { UserCarActionCounts, UserCarActionCountsResponse } from "./userProfile.api.types";
import { ENV } from "@/config/env";

export const getUserCarActionCounts = async (userId: string): Promise<UserCarActionCounts> => {
  const baseURL = ENV.API_URL || ENV.NEXT_PUBLIC_API_URL
  const response = await axios.get<UserCarActionCountsResponse>(`${baseURL}/user-cars/counts/${userId}`);
  console.log('response.data: ', response.data);
  return response.data.result;
};

export const trackCarView = async (userId: string, carId: string, metadata: Record<string, any> = {}): Promise<void> => {
  const baseURL = ENV.API_URL || ENV.NEXT_PUBLIC_API_URL
  const response = await axios.post(`${baseURL}/user-cars/view`, {
    userId,
    carId,
    metadata
  });
  console.log('Car view tracked: ', response.data);
};