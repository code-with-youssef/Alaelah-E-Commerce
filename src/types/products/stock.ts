import { Store } from "../address/store";

export interface Stock {
  id: number;
  product_id: number;
  store_id: number;
  branch_id: number;
  seller_id: number;
  sku: string;
  price: number;
  qty: number;
  alloc_qty: number;
  stores: Store;
}
