//-----------------------------------------------------------------------------------------------

import { PaginationMeta } from "../shared/pagination";

export interface ProductLinks {
  details: string;
}


export interface Product {
  id: number;
  name: string;
  slug:string;
  barcode: string;
  description: string;

  category: string;
  brand: string;
  unit: string;
  unit_type: number;
  variant: string;

  category_id: number;
  category_parent_id: number;
  unit_id: number;
  brand_id: number;

  thumbnail_image: string;
  photos_urls: string[];

  stroked_price: number;
  main_price: number;

  type: number;
  menue_day_id: number;

  alloc_qty: number;
  min_qty: number;
  max_qty: number;
  prod_qty: number;
  measurment: number;

  has_discount: boolean;
  discount: number;

  is_in_wishlist: boolean;
  is_in_cart: boolean;
  qty_in_cart: number;

  stock_qty: number;
}

export interface SearchProduct {
  id: number;
  name: string;
  image?: string;
  price: number;
  unit: string;
}

export interface SearchProductResponse {
  products: SearchProduct[];
  meta: PaginationMeta;
}

export interface ProductsResponse {
  products: Product[];
  meta: PaginationMeta;
}

export type HomeProductsType = "featured" | "todays-deal" | "best-seller";