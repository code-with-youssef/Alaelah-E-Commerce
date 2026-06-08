import { Product, ProductsResponse } from "@/src/types/products/product";
import { apiRequest } from "../shared/apiClient";

/**
 * Full paginated search — used on the /search results page.
 */
export const fetchSearchResults = async (
  query: string,
  page: number = 1,
  nearestStoreId: number | null,
): Promise<ProductsResponse> => {
  let url = `/api/v2/products/search?name=${encodeURIComponent(
    query.trim(),
  )}&page=${page}`;

  if (nearestStoreId !== null) {
    url += `&storeId=${nearestStoreId}`;
  }

  const res = await apiRequest(url);
  if (!res.ok) throw new Error("Failed to fetch search results");

  const json = await res.json();

  return {
    products: json.data as Product[],
    meta: json.meta,
  };
};

/**
 * Lightweight suggestion fetch — grabs the first page and returns
 * only the first `limit` products. Used by the search modal typeahead.
 */
export const fetchSearchSuggestions = async (
  query: string,
  nearestStoreId: number | null,
  limit: number = 3,
): Promise<Product[]> => {
  if (!query.trim()) return [];

  let url = `/api/v2/products/search?name=${encodeURIComponent(
    query.trim(),
  )}&page=1`;

  if (nearestStoreId !== null) {
    url += `&storeId=${nearestStoreId}`;
  }

  const res = await apiRequest(url);
  if (!res.ok) return [];

  const json = await res.json();
  const products = json.data as Product[];

  return products.slice(0, limit);
};