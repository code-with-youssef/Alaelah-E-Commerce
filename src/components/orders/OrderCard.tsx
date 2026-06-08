"use client";

import { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import {
  formatDate,
  formatRelativeTime,
  ORDER_STATUS_META,
  UIOrder,
} from "@/src/config/order";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";
import { useTranslations } from "next-intl";

interface OrderCardProps {
  order: UIOrder;
  onClick: () => void;
  onReorder?: (orderId: string) => void;
  onRate?: (orderId: string, rating: number) => void;
}

/* =========================
   ✅ Item Image Component (pure, receives resolved url as prop)
========================= */
function OrderItemImage({ item, imageUrl }: { item: any; imageUrl: string }) {
  return (
    <div
      className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0"
      style={{ backgroundColor: "var(--color-bg-subtle)" }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xl">
          🛍️
        </div>
      )}

      {item.quantity > 1 && (
        <span
          className="absolute bottom-0.5 right-0.5 text-[9px] font-bold px-1 rounded-full text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          ×{item.quantity}
        </span>
      )}
    </div>
  );
}

/* =========================
   ✅ Wrapper — resolves URL at its own component boundary
========================= */
function OrderItemImageWrapper({ item }: { item: any }) {
  const imageUrl = useResolvedUrl(item.imageUrl);
  return <OrderItemImage item={item} imageUrl={imageUrl} />;
}

/* =========================
   ✅ Main Component
========================= */
export function OrderCard({
  order,
  onClick,
  onReorder,
  onRate,
}: OrderCardProps) {
  const t = useTranslations("orders");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submittedRating, setSubmittedRating] = useState(0);

  const handleRate = (rating: number) => {
    setSubmittedRating(rating);
    onRate?.(order.id, rating);
  };

  const isActive = [
    "pending",
    "confirmed",
    "processing",
    "out_for_delivery",
  ].includes(order.status);

  return (
    <article
      className="rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md group cursor-pointer"
      style={{
        border: "1.5px solid var(--color-border)",
        backgroundColor: "var(--color-bg)",
      }}
      onClick={onClick}
    >
      {/* Header */}
      <div className="w-full flex items-start justify-between px-4 pt-4 pb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p
              className="text-sm font-bold truncate"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text)",
              }}
            >
              {t("orderNumber", { orderNumber: order.orderNumber })}
            </p>
            <OrderStatusBadge status={order.status} />
          </div>

          <p
            className="text-xs"
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {order.date}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          <span
            className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: "var(--color-primary)" }}
          >
            {t("viewDetails")}
          </span>

          <ChevronRightIcon
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
            style={{ color: "var(--color-primary)" }}
          />
        </div>
      </div>

      {/* Items */}
      {order.items.length > 0 && (
        <div className="flex items-center gap-2 px-4 pb-3">
          {order.items.slice(0, 3).map((item) => (
            <OrderItemImageWrapper key={item.id} item={item} />
          ))}

          {order.items.length > 3 && (
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                backgroundColor: "var(--color-bg-subtle)",
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-sans)",
              }}
            >
              +{order.items.length - 3}
            </div>
          )}

          {/* Total */}
          <div className="flex-1 flex justify-end">
            <div className="text-right">
              <p
                className="text-sm font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-text)",
                }}
              >
                {order.currency} {order.grandTotal.toFixed(2)}
              </p>

              <p
                className="text-xs"
                style={{
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {order.items.reduce((sum, i) => sum + i.quantity, 0)}{" "}
                {t("itemsCount")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 text-xs">
          <span style={{ color: "var(--color-text-muted)" }}>
            {t("payment")}:
          </span>

          <span
            className="px-2 py-0.5 rounded-full"
            style={{
              backgroundColor:
                order.paymentStatus === "paid" ? "#dcfce7" : "#fff3cd",
              color: order.paymentStatus === "paid" ? "#166534" : "#856404",
            }}
          >
            {order.paymentStatusText}
          </span>
        </div>
      </div>

      {/* Rating */}
      {order.canRate && !submittedRating && (
        <div
          className="mx-4 mb-3 px-3 py-2.5 rounded-xl flex items-center justify-between"
          style={{
            backgroundColor: "var(--color-bg-subtle)",
            border: "1px solid var(--color-border)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <p
            className="text-xs font-semibold"
            style={{
              color: "var(--color-text)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {t("rateYourOrder")}
          </p>

          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => handleRate(star)}
                className="transition-transform active:scale-110"
              >
                <StarSolid
                  className="w-5 h-5"
                  style={{
                    color:
                      star <= (hoveredStar || 0)
                        ? "#f59e0b"
                        : "var(--color-border)",
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {submittedRating > 0 && (
        <div className="flex items-center gap-1 px-4 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarSolid
              key={star}
              className="w-4 h-4"
              style={{
                color:
                  star <= submittedRating ? "#f59e0b" : "var(--color-border)",
              }}
            />
          ))}

          <span
            className="text-xs ml-1"
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {t("yourRating")}
          </span>
        </div>
      )}
    </article>
  );
}
