import { apiRequest } from "../shared/apiClient";

const PATH = "/api/v2/auth";

export async function updateProfile(name: string, phone: string): Promise<void> {
  const res = await apiRequest(`${PATH}/update-profile`, {
    method: "POST",
    body: JSON.stringify({ name, phone }),
  });
  if (!res.ok) throw new Error("Failed to update profile");
}

export async function deleteAccount(): Promise<void> {
  const res = await apiRequest(`${PATH}/delete-account`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to delete account");
}