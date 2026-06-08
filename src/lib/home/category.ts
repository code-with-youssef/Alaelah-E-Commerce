import { Categories } from "../../types/home/category";
import { apiRequest } from "../shared/apiClient";

export const fetchCategories = async (): Promise<Categories> => {
  const res = await apiRequest("/api/v2/mainCategories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.data;
};

export const fetchSubCategories = async (id: number): Promise<Categories> => {
  const res = await apiRequest(`/api/v2/sub-categories/${id}`);
  if (!res.ok) throw new Error("Failed to fetch sub-categories");
  const data = await res.json();
  return data.data;
};
