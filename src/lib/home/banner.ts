// lib/banner.ts
import { BannerResponse } from "../../types/home/banner";
import { apiRequest } from "../shared/apiClient";


export const fetchBanners = async (bannerNumber: number): Promise<BannerResponse> => {
  const res = await apiRequest(`/api/v2/banner/${bannerNumber}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch banner ${bannerNumber}`);
  }

  return res.json();
};