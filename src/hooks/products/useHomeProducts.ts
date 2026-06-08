import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { fetchHomeProducts } from "../../lib/products/homeProducts";
import { useLocation } from "../../contexts/LocationContext";
import { HomeProductsType, ProductsResponse } from "@/src/types/products/product";

export const useHomeProducts = (
  asc: boolean = true,
  type: HomeProductsType,
) => {
  const { nearestStoreId } = useLocation();

  return useInfiniteQuery({
    queryKey: ["products", asc, type, nearestStoreId],
    queryFn: ({ pageParam = 1 }: { pageParam: number }) =>
      fetchHomeProducts(pageParam, asc, type, nearestStoreId),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ProductsResponse) => {
      if (lastPage.meta.current_page < lastPage.meta.last_page) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
