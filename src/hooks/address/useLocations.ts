import { useQuery } from "@tanstack/react-query";
import { fetchCities, fetchDistricts, fetchStates } from "../../lib/address/location";

export const useStates = (countryId = 1) =>
  useQuery({
    queryKey: ["states", countryId],
    queryFn: () => fetchStates(countryId),
    staleTime: Infinity, // states rarely change
  });

export const useCities = (stateId: number | null) =>
  useQuery({
    queryKey: ["cities", stateId],
    queryFn: () => fetchCities(stateId!),
    enabled: stateId !== null,
    staleTime: Infinity,
  });

export const useDistricts = (cityId: number | null) =>
  useQuery({
    queryKey: ["districts", cityId],
    queryFn: () => fetchDistricts(cityId!),
    enabled: cityId !== null,
    staleTime: Infinity,
  });