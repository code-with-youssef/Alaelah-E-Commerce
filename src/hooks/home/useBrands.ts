import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchBrandBySlug,
  fetchBrands,
  fetchBrandsByCategory,
  fetchTopBrands,
} from "../../lib/home/brand";

type FetchBrandsParams = {
  page?: number;
  perPage?: number;
  search?: string;
};

/** Single-page query — used for the strip preview. */
export const useBrands = (params?: FetchBrandsParams) => {
  return useQuery({
    queryKey: ["brands", params],
    queryFn: () => fetchBrands(params),
    staleTime: 1000 * 60 * 5,
  });
};

/** Top brands query — used for the section preview strip. */
export const useTopBrands = () => {
  return useQuery({
    queryKey: ["brands-top"],
    queryFn: fetchTopBrands,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Infinite / load-more query — used for the modal.
 * Each page is appended to the previous ones so nothing disappears.
 */
export const useBrandsInfinite = (perPage = 30, search?: string) => {
  return useInfiniteQuery({
    queryKey: ["brands-infinite", { perPage, search }],
    queryFn: ({ pageParam = 1 }) =>
      fetchBrands({ page: pageParam as number, perPage, search }),
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });
};

export const useBrand = (brandSlug: string) => {
  return useQuery({
    queryKey: ["brand", brandSlug],
    queryFn: () => fetchBrandBySlug(brandSlug),
    staleTime: 1000 * 60 * 10,
    enabled: !!brandSlug,
  });
};

export const useCategoryBrands = (catId: number) => {
  return useQuery({
    queryKey: ["brands-by-category", catId],
    queryFn: () => fetchBrandsByCategory(catId),
    staleTime: 1000 * 60 * 5,
    enabled: !!catId,
  });
};