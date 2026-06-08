import { Product, ProductsResponse } from "@/src/types/products/product";
import { PaginationMeta } from "../../types/shared/pagination";
import { apiRequest } from "../shared/apiClient";

export const fetchDealsProducts = async (
  page: number = 1,
  nearestStoreId: number | null,
): Promise<ProductsResponse> => {
  let path = `/api/v2/Products/todays-deal?page=${page}`;
  if (nearestStoreId !== null) {
    path += `&store_id=${nearestStoreId}`;
  }

  const res = await apiRequest(path);
  if (!res.ok) throw new Error("Failed to fetch deals products");

  const json = await res.json();
  return {
    products: json.data as Product[],
    meta: json.meta as PaginationMeta,
  };
};