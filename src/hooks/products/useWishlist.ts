import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "../../contexts/LocationContext";
import { addProductToWishlist, fetchWishlist, removeProductFromWishlist } from "../../lib/products/wishlist";
import { WishlistResponse } from "@/src/types/products/wishlist";


// ── Fetch wishlist (paginated, driven by nearest store) ───────────────────────

export function useWishlist(page: number = 1) {
  const { nearestStoreId } = useLocation();

  return useQuery<WishlistResponse, Error>({
    queryKey: ["wishlist", nearestStoreId, page],
    queryFn: () => fetchWishlist(nearestStoreId!, page),
    enabled: nearestStoreId !== null,
    staleTime: 1000 * 60 * 2, // 2 min
    retry: 1,
  });
}

// ── Toggle favourite for a single product (optimistic) ────────────────────────

export function useWishlistToggle(initialState: boolean) {
  const [isInWishlist, setIsInWishlist] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const toggleWishlist = useCallback(async (productId: number) => {
    if (isLoading) return;

    // Flip immediately
    const previous = isInWishlist;
    setIsInWishlist(!previous);
    setIsLoading(true);

    try {
      if (previous) {
        await removeProductFromWishlist(productId);
      } else {
        await addProductToWishlist(productId);
      }
    } catch {
      // Revert on error
      setIsInWishlist(previous);
    } finally {
      setIsLoading(false);
    }
  }, [isInWishlist, isLoading]);

  return { isInWishlist, isLoading, toggleWishlist };
}