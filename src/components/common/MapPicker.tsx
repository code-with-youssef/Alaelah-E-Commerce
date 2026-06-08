// src/components/common/MapPicker.tsx
"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { reverseGeocode, getCurrentPosition } from "@/src/lib/address/geocoding";
import { Coordinates } from "@/src/types/address/location";

export interface MapPickerValue {
  coords: Coordinates;
  address: string;
}

interface MapPickerProps {
  initialCoords?: Coordinates;
  onChange: (value: MapPickerValue) => void;
  pinColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

const CAIRO: Coordinates = { lat: 30.0444, lng: 31.2357 };

function RecenterButton({ onRecenter }: { onRecenter: () => void }) {
  return (
    <button
      className="absolute bottom-4 right-4 w-11 h-11 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform z-10"
      style={{ backgroundColor: "var(--color-bg, white)" }}
      onClick={onRecenter}
      aria-label="Recenter"
      type="button"
    >
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: "var(--color-primary)" }}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function MapPickerInner({
  initialCoords,
  onChange,
  pinColor = "var(--color-primary, #FF4444)",
}: Pick<MapPickerProps, "initialCoords" | "onChange" | "pinColor">) {
  const map = useMap();
  const [markerPos, setMarkerPos] = useState<Coordinates>(initialCoords ?? CAIRO);
  const [geocoding, setGeocoding] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // KEY FIX: store onChange in a ref so resolveCoords / scheduleResolve
  // never need to re-create when the parent passes a new function reference.
  // This breaks the dep chain that was cancelling the user's pick.
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const resolveCoords = useCallback(async (coords: Coordinates) => {
    setGeocoding(true);
    try {
      const { fullAddress } = await reverseGeocode(coords);
      onChangeRef.current({ coords, address: fullAddress }); // ← use ref, not closure
    } catch {
      onChangeRef.current({
        coords,
        address: `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`,
      });
    } finally {
      setGeocoding(false);
    }
  }, []); // ← no deps — never recreates, ref keeps it current

  const scheduleResolve = useCallback((coords: Coordinates) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => resolveCoords(coords), 500);
  }, [resolveCoords]); // resolveCoords is now stable, so this is also stable

  // On mount: pan to GPS or fall back to Cairo
  useEffect(() => {
    if (!map) return;

    if (initialCoords) {
      resolveCoords(initialCoords);
      return;
    }

    getCurrentPosition()
      .then((coords) => {
        map.panTo(coords);
        setMarkerPos(coords);
        resolveCoords(coords);
      })
      .catch(() => {
        resolveCoords(CAIRO);
      });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  const handleMapClick = useCallback((e: MapMouseEvent) => {
    if (!e.detail.latLng) return;
    const coords = { lat: e.detail.latLng.lat, lng: e.detail.latLng.lng };
    setMarkerPos(coords);
    scheduleResolve(coords);
  }, [scheduleResolve]);

  const handleDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(coords);
    scheduleResolve(coords);
  }, [scheduleResolve]);

  const handleRecenter = useCallback(() => {
    getCurrentPosition()
      .then((coords) => {
        map?.panTo(coords);
        setMarkerPos(coords);
        scheduleResolve(coords);
      })
      .catch(() => {});
  }, [map, scheduleResolve]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Map
        defaultCenter={initialCoords ?? CAIRO}
        defaultZoom={17}
        mapId="address-picker"
        gestureHandling="greedy"
        disableDefaultUI
        zoomControl
        onClick={handleMapClick}
        style={{ width: "100%", height: "100%" }}
      >
        <AdvancedMarker position={markerPos} draggable onDragEnd={handleDragEnd}>
          <svg width="36" height="44" viewBox="0 0 36 44" fill="none" style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,.3))" }}>
            <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill={pinColor} />
            <circle cx="18" cy="18" r="7" fill="white" />
          </svg>
        </AdvancedMarker>
      </Map>

      {geocoding && (
        <div className="absolute top-3 left-1/2 z-10 pointer-events-none" style={{ transform: "translateX(-50%)" }}>
          <div className="px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg whitespace-nowrap" style={{ backgroundColor: "white", color: "#333", fontFamily: "var(--font-sans)" }}>
            Locating…
          </div>
        </div>
      )}

      <RecenterButton onRecenter={handleRecenter} />
    </div>
  );
}

export function MapPicker({ initialCoords, onChange, pinColor, className = "", style }: MapPickerProps) {
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", ...style }}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}>
        <MapPickerInner initialCoords={initialCoords} onChange={onChange} pinColor={pinColor} />
      </APIProvider>
    </div>
  );
}