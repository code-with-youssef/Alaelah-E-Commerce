import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFilteredProducts } from "../../lib/products/filter";
import { FilterParams } from "../../types/products/filter";
import { useLocation } from "../../contexts/LocationContext";
import { ProductsResponse } from "@/src/types/products/product";

type UseFilteredProductsParams = Omit<FilterParams, "page" | "storeId"> & {
  enabled?: boolean;
};

export const useFilteredProducts = (params: UseFilteredProductsParams) => {
  const { nearestStoreId } = useLocation();
  const { catId, brandId, minPrice, maxPrice, enabled } = params;

  const isEnabled = enabled !== undefined ? enabled : !!catId;

  return useInfiniteQuery<ProductsResponse, Error>({
    queryKey: [
      "filtered-products",
      catId ?? null,
      brandId ?? null,
      minPrice ?? null,
      maxPrice ?? null,
      nearestStoreId,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fetchFilteredProducts({
        catId,
        brandId,
        minPrice,
        maxPrice,
        page: pageParam as number,
        storeId: nearestStoreId,
      });
      return result;
    },
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: isEnabled,
    retry: (failureCount, error: any) => {
      if (
        error?.status === 404 ||
        error?.response?.status === 404 ||
        error?.statusCode === 404 ||
        error?.message?.includes("No products found") ||
        error?.message?.includes("404")
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
