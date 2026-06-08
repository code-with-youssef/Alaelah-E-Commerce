// src/contexts/LocationContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

import { getCurrentPosition, reverseGeocode } from "../lib/address/geocoding";
import { useNearestStore } from "../hooks/shared/useStores";
import {
  loadNearestStoreId,
  saveNearestStoreId,
  hasPickedLocation,
  setPickedLocation,
  loadSavedAddress,
  saveAddress,
} from "../lib/persistence/storage";
import { ensureGuestId } from "../lib/persistence/guestId";
import { LocationState, Coordinates } from "../types/address/location";
import { getToken } from "../lib/shared/tokenServices";
import { Address } from "../types/address/address";

interface LocationContextValue {
  location: LocationState;
  nearestStoreId: number | null;
  needsLocationPick: boolean;
  confirmLocation: (coords: Coordinates, address?: string) => Promise<void>;
  detectCurrentLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextValue | null>(null);

interface LocationProviderProps {
  children: ReactNode;
  userHasNoAddresses?: boolean;
  addresses?: Address[];
  addressesLoading?: boolean;
}

export function LocationProvider({
  children,
  userHasNoAddresses = false,
  addresses = [],
  addressesLoading = false,
}: LocationProviderProps) {
  const [location, setLocation] = useState<LocationState>({
    coords: null,
    cityName: null,
    detecting: false,
    error: null,
  });

  const [needsLocationPick, setNeedsLocationPick] = useState(false);
  const [cachedStoreId, setCachedStoreId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Prevents the seed effect from running more than once per mount
  const hasSeededRef = useRef(false);

  // On mount: read everything from localStorage at once
  useEffect(() => {
    setIsMounted(true);
    setCachedStoreId(loadNearestStoreId());

    if (!hasPickedLocation()) {
      setNeedsLocationPick(true);
    } else {
      // Restore the saved address immediately — no geocoding needed
      const saved = loadSavedAddress();
      if (saved) {
        setLocation((prev) => ({ ...prev, cityName: saved }));
      }
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (userHasNoAddresses && !hasPickedLocation()) {
      setNeedsLocationPick(true);
    }
  }, [userHasNoAddresses, isMounted]);

  // ── Guest-ID bootstrap ────────────────────────────────────────────────────
  useEffect(() => {
    if (!getToken()) ensureGuestId();
  }, []);

  // ── Nearest store ─────────────────────────────────────────────────────────
  const { data: storeData } = useNearestStore(location.coords);
  const fetchedStoreId = storeData?.data?.id ?? null;

  useEffect(() => {
    if (fetchedStoreId !== null && fetchedStoreId !== cachedStoreId) {
      setCachedStoreId(fetchedStoreId);
      saveNearestStoreId(fetchedStoreId);
    }
  }, [fetchedStoreId, cachedStoreId]);

  const nearestStoreId = fetchedStoreId ?? cachedStoreId;

  // ── GPS detection — only for coords/store resolution, never touches cityName ──
  const detectCurrentLocation = useCallback(async () => {
    setLocation((prev) => ({ ...prev, detecting: true, error: null }));
    try {
      const coords = await getCurrentPosition();
      setLocation((prev) => ({
        ...prev,           // keep existing cityName
        coords,            // update coords so useNearestStore re-resolves
        detecting: false,
        error: null,
      }));
    } catch (err) {
      setLocation((prev) => ({
        ...prev,
        detecting: false,
        error: typeof err === "string" ? err : "Location error.",
      }));
    }
  }, []);

  // ── Confirm location ──────────────────────────────────────────────────────
  const confirmLocation = useCallback(async (coords: Coordinates, address?: string) => {
    setPickedLocation();
    setNeedsLocationPick(false);

    if (address) {
      // Save to localStorage so it survives reloads
      saveAddress(address);
      setLocation({ coords, cityName: address, detecting: false, error: null });
    } else {
      // No address string — geocode once and save the result
      setLocation((prev) => ({ ...prev, coords, detecting: true, error: null }));
      try {
        const { label } = await reverseGeocode(coords);
        saveAddress(label);
        setLocation({ coords, cityName: label, detecting: false, error: null });
      } catch {
        setLocation({ coords, cityName: null, detecting: false, error: null });
      }
    }
  }, []);

  // ── Seed coords on mount ──────────────────────────────────────────────────
  // Waits for mount + addresses fetch to complete before deciding GPS vs default address.
  // hasSeededRef ensures this runs exactly once per mount so manual address
  // switches (confirmLocation) are never overwritten by a late re-run.
  useEffect(() => {
    if (!isMounted || addressesLoading || hasSeededRef.current) return;
    if (needsLocationPick) return;

    hasSeededRef.current = true;

    const defaultAddress = addresses.find((a) => a.set_default === 1);

    if (defaultAddress) {
      // User has a saved default address — seed coords from it, no GPS needed
      setLocation((prev) => ({
        ...prev,
        coords: { lat: defaultAddress.lat, lng: defaultAddress.lang },
        cityName: prev.cityName ?? defaultAddress.address,
      }));
    } else {
      // No saved addresses (guest or new user) — fall back to GPS
      void detectCurrentLocation();
    }
  }, [isMounted, addressesLoading, needsLocationPick]);

  const value = useMemo<LocationContextValue>(
    () => ({ location, nearestStoreId, needsLocationPick, confirmLocation, detectCurrentLocation }),
    [location, nearestStoreId, needsLocationPick, confirmLocation, detectCurrentLocation]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used inside <LocationProvider>");
  return ctx;
}