import { CitiesResponse, DistrictsResponse, StatesResponse } from "../../types/address/location";
import { apiRequest } from "../shared/apiClient";

const GEO_PATH = `/api/v2`;

export const fetchStates = async (countryId = 1): Promise<StatesResponse> => {
  const res = await apiRequest(`${GEO_PATH}/states-by-country/${countryId}`);
  if (!res.ok) throw new Error("Failed to fetch states");
  return res.json();
};

export const fetchCities = async (stateId: number): Promise<CitiesResponse> => {
  const res = await apiRequest(`${GEO_PATH}/cities-by-state/${stateId}`);
  if (!res.ok) throw new Error("Failed to fetch cities");
  return res.json();
};

export const fetchDistricts = async (
  cityId: number,
): Promise<DistrictsResponse> => {
  const res = await apiRequest(`${GEO_PATH}/districts-by-city/${cityId}`);
  if (!res.ok) throw new Error("Failed to fetch districts");
  return res.json();
};
