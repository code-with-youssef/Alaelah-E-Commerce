// lib/purchase.ts
import type {
  OrdersResponse,
  OrderDetailResponse,
  OrderItemsResponse,
} from "../../types/order/order";
import { apiRequest } from "../shared/apiClient";

const PATH = "/api/v2";

// جلب كل الأوردارات
export const fetchOrders = async (
  page = 1,
  pageSize = 10,
): Promise<OrdersResponse> => {
  const res = await apiRequest(
    `${PATH}/purchase-history?page=${page}&page_size=${pageSize}`,
  );
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

// جلب تفاصيل أوردار واحد
export const fetchOrderDetail = async (
  orderId: number,
): Promise<OrderDetailResponse> => {
  const res = await apiRequest(`${PATH}/purchase-history-details/${orderId}`);
  if (!res.ok) throw new Error("Failed to fetch order detail");
  return res.json();
};

// جلب أيتمز أوردار
export const fetchOrderItems = async (
  orderId: number,
): Promise<OrderItemsResponse> => {
  const res = await apiRequest(`${PATH}/purchase-history-items/${orderId}`);
  if (!res.ok) throw new Error("Failed to fetch order items");
  return res.json();
};
