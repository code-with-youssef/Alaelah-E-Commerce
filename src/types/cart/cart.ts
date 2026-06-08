import { Product } from "../products/product";

export interface AddToCartPayload {
  product_id: number;
  quantity: number;
  store_id: number; // removed user_id — backend resolves user from auth/guest header
}

export interface AddToCartResponse {
  message: string;
  cart_count: number;
}

export interface GetCartPayload {
  store_id: number; // removed user_id — backend resolves user from auth/guest header
}

export interface GetCartResponse {
  grand_total: number;
  data: CartData;
}

export interface ChangeQuantityPayload {
  product_id: number;
  quantity: number;
  store_id: number; // removed user_id
}

export interface DeleteCartItemPayload {
  product_id: number; // removed user_id
}

export interface CartActionResponse {
  message: string;
}

export interface CartData {
  name: string;
  owner_id: number;
  sub_total: number;
  cart_items: CartItem[];
}

export interface CartItem {
  id: number;
  slug: string;
  status: number;
  owner_id: number;
  user_id: number;

  product: Product;

  product_name: string;
  auction_product: number;
  product_thumbnail_image: string;
  variation: string;

  currency_symbol: string;
  price: number;
  tax: number;
  shipping_cost: number;

  quantity: number;

  lower_limit: number;
  upper_limit: number;
}