import { Coordinates } from "../../types/address/location";

interface NominatimResult {
  display_name: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

/**
 * Reverse-geocodes a lat/lng pair using OpenStreetMap Nominatim.
 * Returns a short, human-friendly label and the full address string.
 * Falls back gracefully if the network is unavailable.
 */
export async function reverseGeocode(
  coords: Coordinates
): Promise<{ label: string; fullAddress: string }> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", String(coords.lat));
    url.searchParams.set("lon", String(coords.lng));
    url.searchParams.set("format", "json");
    url.searchParams.set("zoom", "18");

    const res = await fetch(url.toString(), {
      headers: { "Accept-Language": "en" },
    });

    if (!res.ok) throw new Error("Nominatim error");

    const data: NominatimResult = await res.json();
    const { address } = data;

    const label =
      address?.road ??
      address?.suburb ??
      address?.city ??
      "Current location";

    const fullAddress = data.display_name ?? label;

    return { label, fullAddress };
  } catch {
    return {
      label: "Current location",
      fullAddress: `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`,
    };
  }
}

/**
 * Wraps the browser Geolocation API in a Promise.
 * Rejects with a descriptive string on error.
 */
export function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            reject("Location permission denied.");
            break;
          case err.POSITION_UNAVAILABLE:
            reject("Location unavailable.");
            break;
          case err.TIMEOUT:
            reject("Location request timed out.");
            break;
          default:
            reject("Unknown location error.");
        }
      },
      { timeout: 10_000, enableHighAccuracy: true }
    );
  });
}