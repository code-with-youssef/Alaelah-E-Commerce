import type { PlaceOrderBody } from "../../types/order/checkout";
import { apiRequest } from "../shared/apiClient";

export interface PlaceOrderResult {
  order_code: string;
  tracking_code: string;
}

export async function placeOrderApi(body: PlaceOrderBody): Promise<PlaceOrderResult> {
  const res = await apiRequest("/api/v2/order/ready", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message ?? `Order failed (${res.status})`);
  }

  const data = await res.json();
  return {
    order_code: data.order_code,
    tracking_code: data.tracking_code,
  };
}