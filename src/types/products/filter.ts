export interface FilterParams {
  catId: number;
  brandId?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  page?: number;
  storeId?: number | null;
}

export interface ActiveFilters {
  brandId: number | null;
  brandName: string | null;
  minPrice: string;
  maxPrice: string;
}