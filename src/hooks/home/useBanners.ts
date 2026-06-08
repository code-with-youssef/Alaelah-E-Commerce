// hooks/useBanners.ts
import { useQuery } from "@tanstack/react-query";
import { fetchBanners } from "../../lib/home/banner";
import { BannerResponse } from "../../types/home/banner";


export const useBanners = (bannerNumber: number) => {
  const query = useQuery<BannerResponse, Error>({
    queryKey: ["banners", bannerNumber],
    queryFn: () => fetchBanners(bannerNumber),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    ...query,
    banners: query.data?.data ?? [],
  };
};