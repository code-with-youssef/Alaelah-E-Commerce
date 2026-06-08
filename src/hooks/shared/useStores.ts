import { useQuery } from "@tanstack/react-query";
import { fetchNearestStore } from "../../lib/address/store";
import { NearestStoreResponse } from "../../types/address/store";

/**
 * Fetches the nearest store for the given coordinates.
 * Pass null to skip the fetch (no active location yet).
 */
export function useNearestStore(coords: { lat: number; lng: number } | null) {
  return useQuery<NearestStoreResponse, Error>({
    queryKey: ["nearest-store", coords?.lat, coords?.lng],
    queryFn: () => fetchNearestStore(coords!.lat, coords!.lng),
    enabled: coords !== null,
    staleTime: 1000 * 60 * 10, // 10 min — store doesn't change often
    retry: 1,
  });
}

/**
 * Returns just the nearest store id, or null if not resolved yet.
 * Convenience wrapper for components that only need the id.
 */
export function useNearestStoreId(
  coords: { lat: number; lng: number } | null
): number | null {
  const { data } = useNearestStore(coords);
  return data?.data?.id ?? null;
}