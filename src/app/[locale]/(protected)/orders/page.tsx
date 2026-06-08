"use client"

import { OrdersClient } from "@/src/components/orders/client/OrdersClient";

export default function Page() {
  return (
    <OrdersClient
      onReorder={(orderId) => {
        /* add items to cart */
      }}
      onRate={(orderId, rating) => {
        /* POST rating to API */
      }}
    />
  );
}
