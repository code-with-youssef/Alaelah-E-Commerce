import { PaginationMeta } from "../../types/shared/pagination";
import type { HomeProductsType, Product, ProductsResponse } from "@/src/types/products/product";
import { apiRequest } from "../shared/apiClient";

export const fetchHomeProducts = async (
  page: number = 1,
  asc: boolean = true,
  type: HomeProductsType,
nearestStoreId: number | null,
): Promise<ProductsResponse> => {
  let path = `/api/v2/Products/${type}?page=${page}&asc=${asc}`;
  if (nearestStoreId !== null) {
    path += `&store_id=${nearestStoreId}`;
  }

  const res = await apiRequest(path);
  if (!res.ok) throw new Error(`Failed to fetch ${type} products`);

  const json = await res.json();
  return {
    products: json.data as Product[],
    meta: json.meta as PaginationMeta,
  };
};