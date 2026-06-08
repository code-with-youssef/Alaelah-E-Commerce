import { apiRequest } from "../shared/apiClient";
import {
  AddToCartPayload,
  AddToCartResponse,
  GetCartPayload,
  GetCartResponse,
  ChangeQuantityPayload,
  DeleteCartItemPayload,
  CartActionResponse,
} from "../../types/cart/cart";

const PATH = "/api/v2/carts";

export const addToCartApi = async (
  payload: AddToCartPayload,
): Promise<AddToCartResponse> => {
  const res = await apiRequest(`${PATH}/change-quantity`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to add to cart");

  return res.json();
};

export const getCartApi = async (
  payload: GetCartPayload,
): Promise<GetCartResponse> => {
  const res = await apiRequest(`${PATH}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to fetch cart");

  return res.json();
};

export const changeQuantityApi = async (
  payload: ChangeQuantityPayload,
): Promise<CartActionResponse> => {
  const res = await apiRequest(`${PATH}/change-quantity`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to change quantity");

  return res.json();
};

export const deleteCartItemApi = async (
  payload: DeleteCartItemPayload,
): Promise<CartActionResponse> => {
  const res = await apiRequest(`${PATH}/delete`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to delete cart item");

  return res.json();
};