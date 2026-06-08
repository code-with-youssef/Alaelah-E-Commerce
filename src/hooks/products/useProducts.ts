import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchBrandProducts,
  fetchProductById,
  fetchProducts,
  fetchRelatedProducts,
} from "../../lib/products/product";
import { useLocation } from "../../contexts/LocationContext";
import { Product, ProductsResponse } from "@/src/types/products/product";

export const useProducts = (id: number, page: number = 1) => {
  const { nearestStoreId } = useLocation();

  return useQuery<ProductsResponse, Error>({
    queryKey: ["products", id, page, nearestStoreId],
    queryFn: () => fetchProducts(id, page, nearestStoreId),
    retry: 1,
    enabled: true,
  });
};

export const useProductDetails = (id: string | number) => {
  const { nearestStoreId } = useLocation();

  return useQuery<Product, Error>({
    queryKey: ["product", id, nearestStoreId],
    queryFn: () => fetchProductById(id!, nearestStoreId),
    enabled: !!id,
    retry: 1,
  });
};

export const usePaginatedRelatedProducts = (id: number, page: number = 1) => {
  const { nearestStoreId } = useLocation();

  return useInfiniteQuery({
    queryKey: ["products", "related", id, nearestStoreId] as const,
    queryFn: async ({ pageParam = 1 }: { pageParam: number }) =>
      fetchRelatedProducts(id, nearestStoreId, pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ProductsResponse) => {
      if (lastPage.meta.current_page < lastPage.meta.last_page) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
    enabled: !!id,
    retry: 1,
  });
};

export const useBrandProducts = (brandId: number) => {
  const { nearestStoreId } = useLocation();

  return useInfiniteQuery({
    queryKey: ["brand-products", brandId, nearestStoreId],
    queryFn: ({ pageParam = 1 }) =>
      fetchBrandProducts(brandId, pageParam as number, nearestStoreId),
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!brandId,
  });
};
