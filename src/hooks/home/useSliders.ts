// hooks/useBanners.ts
import { useQuery } from "@tanstack/react-query";
import { fetchSlider } from "../../lib/home/slider";
import { SliderResponse } from "../../types/home/slider";

export const useSlider = () => {
  const query = useQuery<SliderResponse, Error>({
    queryKey: ["sliders",],
    queryFn: () => fetchSlider(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    ...query,
    banners: query.data?.data ?? [],
  };
};