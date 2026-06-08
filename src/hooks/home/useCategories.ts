import { useQuery } from "@tanstack/react-query";
import { Categories } from "../../types/home/category";
import { fetchCategories, fetchSubCategories } from "../../lib/home/category";

export const useCategories = () => {
  return useQuery<Categories, Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // 5 دقايق cache
    retry: 1, // إعادة المحاولة مرة واحدة لو فشل
  });
};

export const useSubCategories = (id: number | undefined) => {
  return useQuery<Categories, Error>({
    queryKey: ["sub-categories", id],
    queryFn: () => fetchSubCategories(id!),
    staleTime: 1000 * 60 * 5, // 5 دقايق cache
    enabled: !!id, // مش هيعمل fetch لحد ما يجي الـ id
    retry: 1, // إعادة المحاولة مرة واحدة لو فشل
  });
};
