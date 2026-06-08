// app/orders/components/OrderStatusBadge.tsx
"use client";

import { ORDER_STATUS_META } from "@/src/config/order";
import type { OrderStatus } from "@/src/config/order";
import { useTranslations } from "next-intl";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

export function OrderStatusBadge({ status, size = "md" }: OrderStatusBadgeProps) {
  const t = useTranslations("orders");
  const meta = ORDER_STATUS_META[status];

  // Get translated status label
  const getStatusLabel = (statusKey: string): string => {
    switch (statusKey) {
      case "pending":
        return t("statusPending");
      case "confirmed":
        return t("statusConfirmed");
      case "processing":
        return t("statusProcessing");
      case "out_for_delivery":
        return t("statusOutForDelivery");
      case "delivered":
        return t("statusDelivered");
      case "cancelled":
        return t("statusCancelled");
      default:
        return meta.label;
    }
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"
      }`}
      style={{
        backgroundColor: meta.bgColor,
        color: meta.color,
        fontFamily: "var(--font-sans)",
      }}
    >
      {getStatusLabel(status)}
    </span>
  );
}