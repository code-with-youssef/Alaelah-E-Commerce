import { WishlistApiResponse, WishlistResponse } from "@/src/types/products/wishlist";
import { apiRequest } from "../shared/apiClient";

export const fetchWishlist = async (
  storeId: number,
  page: number = 1,
): Promise<WishlistResponse> => {
  const res = await apiRequest(
    `/api/v2/wishlists?storeId=${storeId}&page=${page}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch wishlist");
  }

  const json: WishlistApiResponse = await res.json();

  return {
    products: json.data.map((item) => item.product),
    meta: json.meta,
  };
};

export const addProductToWishlist = async (
  productId: number,
): Promise<void> => {
  const res = await apiRequest(`/api/v2/wishlists-store-product/${productId}`);
  if (!res.ok) throw new Error("Failed to add product to wishlist");
};

export const removeProductFromWishlist = async (
  productId: number,
): Promise<void> => {
  const res = await apiRequest(
    `/api/v2/wishlists-destroy-product/${productId}`,
  );
  if (!res.ok) throw new Error("Failed to remove product from wishlist");
};
