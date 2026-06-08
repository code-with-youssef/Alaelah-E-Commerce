// src/hooks/useCartItemLimits.ts
import { useMemo } from "react";
import { CartItem } from "@/src/types/cart/cart";
import { Product } from "@/src/types/products/product";

export interface ItemLimits {
  minQuantity: number;
  maxQuantity: number;
  availableStock: number;
  measurement: number;
  totalAvailableWeight: number;
}

function computeLimits(product: Product): ItemLimits {
  const type = product.type ?? 0;
  const measurement = product.measurment ?? 1;

  let stockInKg = 0;
  if (type === 0) {
    stockInKg = product.stock_qty ?? 0;
  } else {
    const allocQty = product.stock_qty ?? 0;
    const productQty = product.prod_qty ?? 0;
    stockInKg = Math.max(0, allocQty - productQty);
  }

  const stockInItems = Math.floor(stockInKg / measurement);

  const minFromProductKg = product.min_qty ?? 0;
  const maxFromProductKg = product.max_qty ?? 0;

  const minQuantity =
    minFromProductKg > 0 ? Math.ceil(minFromProductKg / measurement) : 1;

  const maxFromProductItems =
    maxFromProductKg > 0 ? Math.floor(maxFromProductKg / measurement) : 0;

  const hasMaxLimit = maxFromProductKg > 0;
  let maxQuantity = hasMaxLimit
    ? Math.min(maxFromProductItems, stockInItems)
    : stockInItems; // max_qty === 0 → no cap, use full stock

  return {
    minQuantity,
    maxQuantity,
    availableStock: maxQuantity,
    measurement,
    totalAvailableWeight: stockInKg,
  };
}

/** Works for both CartItem and bare Product. */
export function useCartItemLimits(input: CartItem | Product): ItemLimits {
  return useMemo(() => {
    const product = "product" in input ? input.product : input;
    return computeLimits(product);
  }, [input]);
}
