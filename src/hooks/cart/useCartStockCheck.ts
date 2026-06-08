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
  const { cartItems, changeQuantity, removeFromCart } = useCart();
  const { nearestStoreId } = useLocation();
  const [warnings, setWarnings] = useState<StockWarning[]>([]);

  // Track which store+items we already ran corrections for
  // so corrections never fire twice and warnings survive the refetch
  const correctedRef = useRef<string>("");

  // Stable fingerprint based only on original quantities at first load per store.
  // We intentionally key on storeId + productIds only (no quantities) for the
  // "has this store been checked" guard, and separately track quantities.
  const storeKey = nearestStoreId ? String(nearestStoreId) : "";

  // Full fingerprint includes quantities — used to detect the FIRST render
  // for this store (before any correction mutates quantities)
  const fullFingerprint =
    nearestStoreId && cartItems.length > 0
      ? storeKey +
        "|" +
        cartItems.map((i) => `${i.product.id}:${i.quantity}`).join(",")
      : "";

  useEffect(() => {
    if (!fullFingerprint) {
      // No store or empty cart — nothing to check
      return;
    }

    // Already ran corrections for this exact snapshot — skip entirely.
    // This prevents the post-refetch re-run (after changeQuantity) from
    // clearing warnings that were just set.
    if (correctedRef.current === fullFingerprint) return;

    // Detect violations against current stock
    const violated: StockWarning[] = [];

    for (const item of cartItems) {
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

    if (violated.length === 0) return; // nothing to do

    // Mark this snapshot as handled BEFORE firing corrections.
    // When corrections trigger a refetch the fingerprint will change,
    // the effect re-runs, but correctedRef already matches → early return.
    correctedRef.current = fullFingerprint;

    // Show warnings — these survive until the user dismisses them
    setWarnings((prev) => {
      const existingIds = new Set(prev.map((w) => w.productId));
      const newOnes = violated.filter((v) => !existingIds.has(v.productId));
      return newOnes.length > 0 ? [...prev, ...newOnes] : prev;
    });

    // Correct quantities silently in the background
    violated.forEach(({ productId, availableQty }) => {
      if (availableQty <= 0) {
        void removeFromCart(productId);
      } else {
        void changeQuantity(productId, availableQty);
      }
    });
  }, [fullFingerprint]); // eslint-disable-line react-hooks/exhaustive-deps

  // When store changes, reset so we re-check for the new store
  useEffect(() => {
    if (!storeKey) return;
    correctedRef.current = "";
    setWarnings([]);
  }, [storeKey]);

  const dismissWarning = (productId: number) =>
    setWarnings((prev) => prev.filter((w) => w.productId !== productId));

  const dismissAll = () => setWarnings([]);

  return { warnings, dismissWarning, dismissAll };
}