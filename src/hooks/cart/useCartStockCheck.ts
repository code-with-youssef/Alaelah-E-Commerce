"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./useCart";
import { useLocation } from "../../contexts/LocationContext";

export interface StockWarning {
  productId: number;
  productName: string;
  requestedQty: number;
  availableQty: number; // 0 = out of stock completely
}

export function useCartStockCheck() {
  const { cartItems } = useCart();
  const { nearestStoreId } = useLocation();
  const [warnings, setWarnings] = useState<StockWarning[]>([]);

  // Track which store+items snapshot we already evaluated,
  // so we don't recompute warnings unnecessarily on every render.
  const evaluatedRef = useRef<string>("");

  const storeKey = nearestStoreId ? String(nearestStoreId) : "";

  // Fingerprint includes quantities — re-evaluate whenever the cart
  // (or the store) changes, e.g. after the user manually adjusts quantity.
  const fullFingerprint =
    nearestStoreId && cartItems.length > 0
      ? storeKey +
        "|" +
        cartItems.map((i) => `${i.product.id}:${i.quantity}`).join(",")
      : "";

  useEffect(() => {
    if (!fullFingerprint) {
      setWarnings([]);
      evaluatedRef.current = "";
      return;
    }

    if (evaluatedRef.current === fullFingerprint) return;
    evaluatedRef.current = fullFingerprint;

    const violated: StockWarning[] = [];

    for (const item of cartItems) {
      // Products with negative stock enabled are never checked against stock.
      if (item.product.is_nagtive_stock_enable) continue;

      const measurement = item.product.measurment ?? 1;
      const stockKg = item.product.stock_qty ?? 0;
      const availableItems = Math.floor(stockKg / measurement);

      if (item.quantity > availableItems) {
        violated.push({
          productId: item.product.id,
          productName: item.product_name,
          requestedQty: item.quantity,
          availableQty: availableItems,
        });
      }
    }

    // Fully recompute from the current snapshot every time — this lets
    // warnings disappear on their own once the user manually fixes the
    // quantity, and lets new violations appear if they raise it again.
    setWarnings(violated);
  }, [fullFingerprint]); // eslint-disable-line react-hooks/exhaustive-deps

  // When store changes, reset so we re-check fresh for the new store
  useEffect(() => {
    if (!storeKey) return;
    evaluatedRef.current = "";
    setWarnings([]);
  }, [storeKey]);

  const dismissWarning = (productId: number) =>
    setWarnings((prev) => prev.filter((w) => w.productId !== productId));

  const dismissAll = () => setWarnings([]);

  const hasUnresolvedWarnings = warnings.length > 0;

  return { warnings, dismissWarning, dismissAll, hasUnresolvedWarnings };
}