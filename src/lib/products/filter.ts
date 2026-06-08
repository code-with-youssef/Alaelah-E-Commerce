import { ProductsResponse } from "@/src/types/products/product";
import { FilterParams } from "../../types/products/filter";
import { apiRequest } from "../shared/apiClient";

// lib/filter.ts
export const fetchFilteredProducts = async (
  params: FilterParams,
): Promise<ProductsResponse> => {
  const { catId, brandId, minPrice, maxPrice, page = 1, storeId } = params;

  const query = new URLSearchParams();
  query.set("catId", String(catId));
  query.set("page", String(page));
  if (brandId != null) query.set("brandid", String(brandId));
  if (storeId != null) query.set("store_id", String(storeId));
  if (minPrice != null) query.set("minPrice", String(minPrice));
  if (maxPrice != null) query.set("maxPrice", String(maxPrice));

  // ✅ catId is already being sent, so the URL is correct
  // Example: /api/v2/Products/searchWithCatIdAndBrandAndName?catId=123&page=1&brandid=456&minPrice=10&maxPrice=100

  const path = `/api/v2/Products/searchWithCatIdAndBrandAndName?${query.toString()}`;
  const res = await apiRequest(path);

  // Handle 404 specifically - this is "no products found", not a real error
  if (res.status === 404) {
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(
      errorData.message || "No products found matching your search",
    );
    (error as any).status = 404;
    throw error;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch filtered products: ${res.status}`);
  }

  const json = await res.json();
  return {
    products: json.data,
    meta: json.meta,
  };
};
