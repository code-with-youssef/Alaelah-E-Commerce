"use client";

import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  buildInstantSlot,
  buildTodaySlots,
  buildUpcomingDays,
  slotToISOString,
} from "../../config/slots";
import type {
  BillingInfo,
  CheckoutFormState,
  DeliverySlot,
  PlaceOrderBody,
} from "../../types/order/checkout";
import { placeOrderApi } from "../../lib/orders/checkout";

// ─── Types ────────────────────────────────────────────────────

export type SlotTab = "today" | "schedule";

export interface UseCheckoutReturn {
  formState: CheckoutFormState;
  selectedAddressId: number | null;
  setSelectedAddressId: (id: number | null) => void;
  orderNote: string;
  setOrderNote: (note: string) => void;
  additionalInfo: string;
  setAdditionalInfo: (info: string) => void;

  slotTab: SlotTab;
  setSlotTab: (tab: SlotTab) => void;
  selectedSlotId: string;
  setSelectedSlotId: (id: string) => void;

  instantSlot: DeliverySlot;
  todaySlots: DeliverySlot[];
  upcomingDays: { dateKey: string; label: string; slots: DeliverySlot[] }[];
  selectedScheduleDay: string;
  setSelectedScheduleDay: (key: string) => void;

  billing: Partial<BillingInfo>;
  setBilling: (patch: Partial<BillingInfo>) => void;

  canPlaceOrder: boolean;
  isPlacing: boolean;
  // Returns order_code on success, null if aborted before API call
  placeOrder: (options?: PlaceOrderOptions) => Promise<string | null>;
  placeOrderError: string | null;
}

export interface PlaceOrderOptions {
  billing?: BillingInfo;
}

// ─── Hook ─────────────────────────────────────────────────────

export function useCheckout(): UseCheckoutReturn {
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [orderNote, setOrderNote] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const [billing, setBillingState] = useState<Partial<BillingInfo>>({});
  const setBilling = (patch: Partial<BillingInfo>) =>
    setBillingState((prev) => ({ ...prev, ...patch }));

  const instantSlot = useMemo(() => buildInstantSlot(), []);
  const todaySlots = useMemo(() => buildTodaySlots(), []);
  const upcomingDays = useMemo(() => buildUpcomingDays(), []);

  const [slotTab, setSlotTab] = useState<SlotTab>("today");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("instant");

  const [selectedScheduleDay, setSelectedScheduleDay] = useState<string>(
    upcomingDays[0]?.dateKey ?? "",
  );

  const selectedSlot = useMemo((): DeliverySlot | undefined => {
    if (selectedSlotId === "instant") return instantSlot;

    const todayMatch = todaySlots.find((s) => s.id === selectedSlotId);
    if (todayMatch) return todayMatch;

    for (const day of upcomingDays) {
      const match = day.slots.find((s) => s.id === selectedSlotId);
      if (match) return match;
    }

    return undefined;
  }, [selectedSlotId, instantSlot, todaySlots, upcomingDays]);

  const formState: CheckoutFormState = {
    paymentMethod: "cashOnDelivery",
    selectedAddressId,
    deliveredDate: selectedSlot?.date ?? null,
    orderNote: orderNote || undefined,
    additionalInfo: additionalInfo || undefined,
  };

  const canPlaceOrder =
    selectedAddressId !== null && selectedSlot !== undefined;

  const [placeOrderError, setPlaceOrderError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (body: PlaceOrderBody) => placeOrderApi(body),
    onError: (err: Error) => setPlaceOrderError(err.message),
    onSuccess: () => setPlaceOrderError(null),
  });

  // Returns order_code directly from mutateAsync so callers don't have to
  // wait for React state to flush before reading the value
  const placeOrder = async (options?: PlaceOrderOptions): Promise<string | null> => {
    if (!selectedSlot) return null;
    if (selectedAddressId === null && !options?.billing) return null;

    setPlaceOrderError(null);

    const body: PlaceOrderBody = {
      payment_method: "cashOnDelivery",
      delivered_date: slotToISOString(selectedSlot),
      order_note: orderNote || undefined,
      additional_info: additionalInfo || undefined,
      ...(selectedAddressId !== null
        ? { selected_address: selectedAddressId }
        : {}),
      ...(options?.billing ? { billing: options.billing } : {}),
    };

    const result = await mutation.mutateAsync(body);
    return result.order_code ?? null;
  };

  return {
    formState,
    selectedAddressId,
    setSelectedAddressId,
    orderNote,
    setOrderNote,
    additionalInfo,
    setAdditionalInfo,

    billing,
    setBilling,

    slotTab,
    setSlotTab,
    selectedSlotId,
    setSelectedSlotId,

    instantSlot,
    todaySlots,
    upcomingDays,
    selectedScheduleDay,
    setSelectedScheduleDay,

    canPlaceOrder,
    isPlacing: mutation.isPending,
    placeOrder,
    placeOrderError,
  };
}