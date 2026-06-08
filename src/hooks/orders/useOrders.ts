"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  OrdersResponse,
  OrderDetailResponse,
  OrderItemsResponse,
} from "../../types/order/order";
import { fetchOrderDetail, fetchOrderItems, fetchOrders } from "../../lib/orders/order";

// Hook لجلب كل الأوردارات
export const useOrders = (page = 1, pageSize = 10) =>
  useQuery<OrdersResponse>({
    queryKey: ["orders", page, pageSize],
    queryFn: () => fetchOrders(page, pageSize),
  });

// Hook لجلب تفاصيل أوردار واحد
export const useOrderDetail = (orderId?: number) =>
  useQuery<OrderDetailResponse>({
    queryKey: ["orderDetail", orderId],
    queryFn: () => fetchOrderDetail(orderId!),
    enabled: !!orderId,
  });

// Hook لجلب أيتمز الأوردار
export const useOrderItems = (orderId?: number) =>
  useQuery<OrderItemsResponse>({
    queryKey: ["orderItems", orderId],
    queryFn: () => fetchOrderItems(orderId!),
    enabled: !!orderId,
  });
