// src/hooks/useProductLimits.ts
import { useMemo } from "react";
import { Product } from "@/src/types/products/product";
export interface ProductLimits {
  minQuantity: number; // Minimum in ITEMS (pieces)
  maxQuantity: number; // Maximum in ITEMS (pieces)
  availableStock: number; // Available stock in ITEMS (pieces)
  measurement: number; // KG per item (for display only)
  totalAvailableWeight: number; // Total stock in KG (for reference)
}

export function useProductLimits(product: Product): ProductLimits {
  return useMemo(() => {
    const type = product.type ?? 0;

    // KG per item — 1 if no variant (regular piece product)
    const measurement = product.measurment ?? 1;

    // Calculate available stock in KG based on product type
    // type === 0 → use stock_qty directly
    // type !== 0 → available = allocated - produced
    let stockInKg = 0;
    if (type === 0) {
      stockInKg = product.stock_qty ?? 0;
    } else {
      const allocQty = product.stock_qty ?? 0;
      const productQty = product.prod_qty ?? 0;
      stockInKg = Math.max(0, allocQty - productQty);
    }

    // Convert stock KG → items
    const stockInItems = Math.floor(stockInKg / measurement);

    // min/max from product are in KG — convert to items
    const minFromProductKg = product.min_qty ?? 0;
    const maxFromProductKg = product.max_qty ?? 0;

    const minFromProductItems =
      minFromProductKg > 0 ? Math.ceil(minFromProductKg / measurement) : 1; // default: at least 1 item

    const maxFromProductItems =
      maxFromProductKg > 0 ? Math.floor(maxFromProductKg / measurement) : 0;

    // Final min in items
    const minQuantity = minFromProductItems;

    // Final max in items — capped by stock, then by product max if set
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
  }, [product]);
}
