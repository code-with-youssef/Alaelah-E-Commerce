// ─── API address (comes from /api/v2/user/shipping/address) ───────────────────

export interface Address {
  id: number;
  user_id: number;

  address: string;
  building_number: string;
  floor: string | null;
  room: string | null;
  street: string | null;
  landmark: string | null;

  country_id: number;
  state_id: number;
  district_id: number | null;
  city_id: number;
  region_id: number | null;

  phone: string;

  lat: number;
  lang: number; // API uses "lang" not "lng"

  set_default: number;
  location_available: boolean;

  country_cost: number;
  state_cost: number;
  city_cost: number;
  district_cost: number;
  region_cost: number;

  country_name: string;
  state_name: string;
  city_name: string;
  district_name: string | null;
  region_name: string | null;

  created_at: string;
  updated_at: string;
}

export interface AddressesResponse {
  success: boolean;
  message: string;
  data: Address[];
}

// ─── Create address payload ───────────────────────────────────────────────────

export interface CreateAddressPayload {
  address: string;
  street: string;
  state_id: number;
  district_id: number;
  city_id: number;
  phone?: string;
  latitude: number;
  longitude: number;
  // optional
  building_number?: string;
  floor?: string;
  room?: string;
  landmark?: string;
  country_id?: number;
  region_id?: number;
  postal_code?: string;
}

