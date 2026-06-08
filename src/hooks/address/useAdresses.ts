import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAddresses,
  deleteAddressApi,
  makeDefaultAddressApi,
} from "../../lib/address/address";
import { AddressesResponse } from "../../types/address/address";

const ADDRESSES_KEY = ["addresses"];

export const useAddresses = () => {
  const queryClient = useQueryClient();

  const query = useQuery<AddressesResponse, Error>({
    queryKey: ADDRESSES_KEY,
    queryFn: fetchAddresses,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });

  // ── Delete (optimistic) ───────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAddressApi(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ADDRESSES_KEY });
      const snapshot =
        queryClient.getQueryData<AddressesResponse>(ADDRESSES_KEY);
      queryClient.setQueryData<AddressesResponse>(ADDRESSES_KEY, (old) => {
        if (!old) return old;
        return { ...old, data: old.data.filter((a) => a.id !== id) };
      });
      return { snapshot };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(ADDRESSES_KEY, ctx.snapshot);
    },
    onSettled: invalidate,
  });

  // ── Make default (optimistic) ─────────────────────────────────
  const makeDefaultMutation = useMutation({
    mutationFn: (id: number) => makeDefaultAddressApi(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ADDRESSES_KEY });
      const snapshot =
        queryClient.getQueryData<AddressesResponse>(ADDRESSES_KEY);
      queryClient.setQueryData<AddressesResponse>(ADDRESSES_KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((a) => ({
            ...a,
            set_default: a.id === id ? 1 : 0,
          })),
        };
      });
      return { snapshot };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(ADDRESSES_KEY, ctx.snapshot);
    },
    onSettled: invalidate,
  });

  return {
    addresses: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,

    deleteAddress: (id: number) => deleteMutation.mutateAsync(id),
    makeDefault: (id: number) => makeDefaultMutation.mutateAsync(id),

    isDeleting: deleteMutation.isPending,
    deletingId: deleteMutation.isPending
      ? ((deleteMutation.variables as number | undefined) ?? null)
      : null,
    isMakingDefault: makeDefaultMutation.isPending,
    makingDefaultId: makeDefaultMutation.isPending
      ? ((makeDefaultMutation.variables as number | undefined) ?? null)
      : null,
  };
};