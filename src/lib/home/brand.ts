import { Brand, BrandsResponse } from "../../types/home/brand";
import { apiRequest } from "../shared/apiClient";

type FetchBrandsParams = {
  page?: number;
  perPage?: number;
  search?: string;
};

const buildQueryString = (params?: Record<string, any>): string => {
  if (!params) return "";

  const query = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");

  return query ? `?${query}` : "";
};

export const fetchBrands = async (
  params?: FetchBrandsParams,
): Promise<BrandsResponse> => {
  const queryString = buildQueryString(params);
  const res = await apiRequest(`/api/v2/brands${queryString}`);

  if (!res.ok) throw new Error("Failed to fetch brands");

  const json = await res.json();

  return {
    brands: json.data,
    meta: json.meta,
  };
};

/** Fetches the curated top brands list from the dedicated endpoint. */
export const fetchTopBrands = async (): Promise<Brand[]> => {
  const res = await apiRequest(`/api/v2/top-brands`);
  if (!res.ok) throw new Error("Failed to fetch top brands");
  const json = await res.json();
  // Adjust `json.data` to match your API envelope shape if needed
  return json.data as Brand[];
};

export const fetchBrandBySlug = async (brandSlug: string): Promise<Brand> => {
  const res = await apiRequest(`/api/v2/brands/slug/${brandSlug}`);
  if (!res.ok) throw new Error("Failed to fetch brand");
  const json = await res.json();
  return json as Brand;
};

export const fetchBrandsByCategory = async (
  catId: number,
  page = 1,
  perPage = 50,
): Promise<BrandsResponse> => {
  const res = await apiRequest(
    `/api/v2/brands-by-category/${catId}?page=${page}&perPage=${perPage}`,
  );
  if (!res.ok) throw new Error("Failed to fetch brands by category");
  const json = await res.json();
  return {
    brands: json.data,
    meta: json.meta,
  };
};