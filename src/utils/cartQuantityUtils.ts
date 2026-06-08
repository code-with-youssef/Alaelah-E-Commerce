// src/utils/cartQuantityUtils.ts
export interface QuantityValidationResult {
  isValid: boolean;
  error?: string;
  suggestedQuantity?: number;
}

type TranslateFunction = (key: string, params?: Record<string, any>) => string;

export function validateQuantity(
  newQty: number, // quantity in ITEMS
  minQty: number, // min in ITEMS
  maxQty: number, // max in ITEMS
  availableStock: number, // stock in ITEMS
  measurement: number, // KG per item (not used for step validation anymore)
  t: TranslateFunction,
): QuantityValidationResult {
  // Must be a whole number of items
  if (!Number.isInteger(newQty) || newQty < 0) {
    return {
      isValid: false,
      error: t("quantitySelector.errors.wholeItems"),
      suggestedQuantity: Math.max(minQty, Math.round(newQty)),
    };
  }

  if (newQty < minQty) {
    return {
      isValid: false,
      error: t("quantitySelector.errors.minQuantity", {
        minQty,
        plural: minQty !== 1 ? "s" : "",
      }),
      suggestedQuantity: minQty,
    };
  }

  if (newQty > maxQty) {
    return {
      isValid: false,
      error: t("quantitySelector.errors.maxQuantity", {
        maxQty,
        plural: maxQty !== 1 ? "s" : "",
      }),
      suggestedQuantity: maxQty,
    };
  }

  return { isValid: true };
}

export function getMaxQuantityMessage(
  maxQty: number, // max in ITEMS
  availableStock: number, // stock in ITEMS
  maxFromProduct: number, // max from product in ITEMS
  measurement: number, // KG per item (unused here, kept for compat)
  unitName: string,
  t: TranslateFunction,
): string {
  const isPlural = maxQty !== 1;

  if (maxFromProduct > 0 && maxFromProduct <= availableStock) {
    return t("quantitySelector.messages.maxWithProduct");
  } else if (availableStock < maxFromProduct || maxFromProduct === 0) {
    return t("quantitySelector.messages.onlyAvailable", { maxQty });
  }
  return t("quantitySelector.messages.maximum");
}
