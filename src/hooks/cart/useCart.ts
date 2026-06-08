"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "../../contexts/LocationContext";
import {
  addToCartApi,
  getCartApi,
  changeQuantityApi,
  deleteCartItemApi,
} from "../../lib/cart/cart";
import { CartItem } from "../../types/cart/cart";
import { Product } from "@/src/types/products/product";

export function useCart() {
  const { nearestStoreId } = useLocation();
  const queryClient = useQueryClient();

  // No user_id in the key — cart is identified by store + session (guest or auth)
  const cartKey = ["cart", nearestStoreId];

  const cartQuery = useQuery({
    queryKey: cartKey,
    queryFn: () => getCartApi({ store_id: nearestStoreId! }),
    enabled: !!nearestStoreId,
  });

  const invalidateCart = () =>
    queryClient.invalidateQueries({ queryKey: cartKey });

  const getSnapshot = () => queryClient.getQueryData(cartKey);

  // ── Add to cart ───────────────────────────────────────────────
  const addMutation = useMutation({
    mutationFn: (data: { product: Product; quantity: number }) =>
      addToCartApi({
        product_id: data.product.id,
        quantity: data.quantity,
        store_id: nearestStoreId!,
      }),
    onSuccess: invalidateCart,
  });

  // ── Change quantity (optimistic) ──────────────────────────────
  const changeQuantityMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      changeQuantityApi({
        product_id: productId,
        quantity,
        store_id: nearestStoreId!,
      }),
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartKey });
      const snapshot = getSnapshot();
      queryClient.setQueryData(cartKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            cart_items: old.data.cart_items.map((item: CartItem) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          },
        };
      });
      return { snapshot };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(cartKey, ctx.snapshot);
    },
    onSettled: invalidateCart,
  });

  // ── Remove item (optimistic) ──────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: ({ productId }: { productId: number }) =>
      deleteCartItemApi({ product_id: productId }),
    onMutate: async ({ productId }) => {
      await queryClient.cancelQueries({ queryKey: cartKey });
      const snapshot = getSnapshot();
      queryClient.setQueryData(cartKey, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            cart_items: old.data.cart_items.filter(
              (item: CartItem) => item.product.id !== productId
            ),
          },
        };
      });
      return { snapshot };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(cartKey, ctx.snapshot);
    },
    onSettled: invalidateCart,
  });

  const cartItems = cartQuery.data?.data?.cart_items ?? [];

  return {
    cart: cartQuery.data?.data,
    cartItems,
    cartCount: cartItems.length,
    grandTotal: cartQuery.data?.grand_total ?? 0,
    isLoading: cartQuery.isLoading,

    addToCart: (product: Product, quantity: number) =>
      addMutation.mutateAsync({ product, quantity }),
    changeQuantity: (productId: number, quantity: number) =>
      changeQuantityMutation.mutateAsync({ productId, quantity }),
    removeFromCart: (productId: number) =>
      deleteMutation.mutateAsync({ productId }),

    isAdding: addMutation.isPending,
  };
}