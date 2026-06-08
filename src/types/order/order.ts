import { Product } from "../products/product";

export interface OrderSummary {
  id: number;
  code: string;
  user_id: number;
  payment_type: string;
  payment_status: string;
  payment_status_string: string;
  delivery_status: string;
  delivery_status_string: string;
  grand_total: number;
  date: string;
}

// Response من API الأوردارات
export interface OrdersResponse {
  success: boolean;
  message: string;
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
  data: OrderSummary[];
}

// -----------------------------
// واجهة لتفاصيل الأوردار (Order Details)
// -----------------------------
export interface ShippingAddress {
  code: string;
  name: string;
  email?: string | null;
  address: string;
  country: string;
  state: string;
  city: string;
  district: string;
  region_Code: string;
  region_Name: string;
  postal_Code?: string | null;
  phone: string;
  full_Name?: string | null;
  lat_Lang: string;
}

export interface OrderDetail {
  id: number;
  code: string;
  user_id: number;
  shipping_address: ShippingAddress | string; // لو JSON string جاي من السيرفر
  payment_type: string;
  pickup_point: number;
  shipping_type: string;
  shipping_type_string: string;
  payment_status: string;
  payment_status_string: string;
  delivery_status: string;
  delivery_status_string: string;
  grand_total: number;
  plane_grand_total: number;
  coupon_discount: number;
  shipping_cost: number;
  subtotal: number;
  tax: number;
  date: string;
  cancel_request: boolean;
  manually_payable: boolean;
}

export interface OrderDetailResponse {
  success: boolean;
  message: string;
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
  data: OrderDetail[];
}

// -----------------------------
// واجهة لأيتمز الأوردار (Order Items)
// -----------------------------
export interface OrderItem {
  id: number;
  product: Product;
  product_id: number;
  product_name: string;
  variation: string;
  price: number;
  tax: number;
  shipping_cost: number;
  coupon_discount: number;
  quantity: number;
  payment_status: string;
  payment_status_string: string;
  delivery_status: string;
  delivery_status_string: string;
  refund_section: boolean;
  refund_button: boolean;
  refund_label: string;
  refund_request_status: number;
}

export interface OrderItemsResponse {
  success: boolean;
  message: string;
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
  data: OrderItem[];
}