// lib/banner.ts
import { BannerResponse } from "../../types/home/banner";
import { SliderResponse } from "../../types/home/slider";
import { apiRequest } from "../shared/apiClient";


export const fetchSlider = async (): Promise<SliderResponse> => {
  const res = await apiRequest(`/api/v2/home-slider`);

  if (!res.ok) {
    throw new Error(`Failed to fetch home sliders`);
  }

  return res.json();
};