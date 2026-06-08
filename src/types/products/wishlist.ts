import { PaginationMeta } from "../shared/pagination";
import { Product } from "./product";

export interface WishlistItem {
  id: number;
  product: Product;
}

export interface WishlistApiResponse {
  data: WishlistItem[];
  meta: PaginationMeta;
}

export interface WishlistResponse {
  products: Product[];
  meta: PaginationMeta;
}