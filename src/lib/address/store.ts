import { NearestStoreResponse } from "../../types/address/store";
import { apiRequest } from "../shared/apiClient";

export const fetchNearestStore = async (
  lat: number,
  lng: number,
): Promise<NearestStoreResponse> => {
  const res = await apiRequest(
    `/api/v2/stores/main-store?lat=${lat}&long=${lng}`,
  );
  if (!res.ok) throw new Error("Failed to fetch nearest store");
  return res.json();
};
