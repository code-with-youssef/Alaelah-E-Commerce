import { Product, ProductsResponse } from "@/src/types/products/product";
import { PaginationMeta } from "../../types/shared/pagination";
import { apiRequest } from "../shared/apiClient";

export const fetchProducts = async (
  id: number,
  page: number = 1,
  nearestStoreId: number | null,
): Promise<ProductsResponse> => {
  let path = `/api/v2/products/category/${id}?page=${page}`;
  if (nearestStoreId !== null) {
    path += `&store_id=${nearestStoreId}`;
  }

  const res = await apiRequest(path);
  if (!res.ok) throw new Error("Failed to fetch products");
  const json = await res.json();
  return {
    products: json.data as Product[],
    meta: json.meta as PaginationMeta,
  };
};

export const fetchRelatedProducts = async (
  productId: number,
  nearestStoreId: number | null,
  page: number = 1,
  perPage: number = 10,
): Promise<ProductsResponse> => {
  let path = `/api/v2/products/related/${productId}?page=${page}&per_page=${perPage}`;
  if (nearestStoreId !== null) {
    path += `&store_id=${nearestStoreId}`;
  }

  const res = await apiRequest(path);
  if (!res.ok) throw new Error("Failed to fetch related products");

  const json = await res.json();
  return {
    products: json.data as Product[],
    meta: json.meta as PaginationMeta,
  };
};

export const fetchProductById = async (
  id: string | number,
  nearestStoreId: number | null
): Promise<Product> => {
  let path = `/api/v2/products/${id}?storeId=${nearestStoreId}`;

  const res = await apiRequest(path);
  if (!res.ok) throw new Error("Failed to fetch product details");

  const json = await res.json();

  if (json.data && Array.isArray(json.data) && json.data.length > 0) {
    return json.data[0] as Product;
  }

  throw new Error("Product not found in the response");
};

export const fetchBrandProducts = async (
  brandId: number,
  page: number = 1,
  nearestStoreId: number | null,
): Promise<ProductsResponse> => {
  let path = `/api/v2/products/brand/${brandId}?page=${page}`;
  if (nearestStoreId !== null) {
    path += `&store_id=${nearestStoreId}`;
  }

  const res = await apiRequest(path);
  if (!res.ok) throw new Error("Failed to fetch brand products");

  const json = await res.json();
  return {
    products: json.data as Product[],
    meta: json.meta as PaginationMeta,
  };
};
