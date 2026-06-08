"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/src/types/products/product";
import { fetchSearchSuggestions } from "../../lib/products/search";
import { useLocation } from "../../contexts/LocationContext";

const DEBOUNCE_MS = 350;

interface UseSearchSuggestionsResult {
  suggestions: Product[];
  isLoading: boolean;
}

/**
 * Debounced typeahead hook.
 * Returns up to `limit` product suggestions while the user types.
 * Fires only after the user pauses for DEBOUNCE_MS milliseconds.
 */
export function useSearchSuggestions(
  query: string,
  limit: number = 3,
): UseSearchSuggestionsResult {
  const { nearestStoreId } = useLocation();
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetch = useCallback(
    (q: string) => {
      // Cancel any in-flight request
      abortRef.current?.abort();

      if (!q.trim()) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      fetchSearchSuggestions(q, nearestStoreId, limit)
        .then((results) => {
          setSuggestions(results);
        })
        .catch(() => {
          setSuggestions([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [nearestStoreId, limit],
  );

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!query.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    timerRef.current = setTimeout(() => {
      fetch(query);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, fetch]);

  return { suggestions, isLoading };
}