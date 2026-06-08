import { AddressesResponse, CreateAddressPayload } from "../../types/address/address";
import { apiRequest } from "../shared/apiClient";

const PATH = "/api/v2/user/shipping";

// ─── Addresses ────────────────────────────────────────────────────────────────

export const fetchAddresses = async (): Promise<AddressesResponse> => {
  const res = await apiRequest(`${PATH}/address`);
  if (!res.ok) throw new Error("Failed to fetch addresses");
  return res.json();
};

export const deleteAddressApi = async (id: number): Promise<void> => {
  const res = await apiRequest(`${PATH}/delete/${id}`, {
  });
  if (!res.ok) throw new Error("Failed to delete address");
};

export const makeDefaultAddressApi = async (id: number): Promise<void> => {
  const res = await apiRequest(`${PATH}/make_default`, {
    method: "POST",
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to set default address");
};

export const createAddressApi = async (
  payload: CreateAddressPayload,
): Promise<void> => {
  const res = await apiRequest(`${PATH}/create`, {
    method: "POST",
    body: JSON.stringify({ country_id: 1, ...payload }),
  });
  if (!res.ok) throw new Error("Failed to create address");
};

export const updateAddress = async (
  payload: CreateAddressPayload,
  id: number,
): Promise<void> => {
  const res = await apiRequest(`${PATH}/update/${id}`, {
    method: "POST",
    body: JSON.stringify({ country_id: 1, ...payload }),
  });
  if (!res.ok) throw new Error("Failed to update address");
};

