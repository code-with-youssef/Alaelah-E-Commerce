export interface Coordinates {
  lat: number;
  lng: number;
}
export interface State {
  id: number;
  name: string;
  status: boolean;
}

export interface City {
  id: number;
  name: string;
  cost: number;
}

export interface District {
  id: number;
  name: string;
  cost: number;
}

export interface StatesResponse {
  success: boolean;
  data: State[];
}

export interface CitiesResponse {
  success: boolean;
  data: City[];
}

export interface DistrictsResponse {
  success: boolean;
  data: District[];
}

// ─── LocationContext ──────────────────────────────────────────────────────────

export interface LocationState {
  coords: Coordinates | null;
  cityName: string | null;
  detecting: boolean;
  error: string | null;
}
