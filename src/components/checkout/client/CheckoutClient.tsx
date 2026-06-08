"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { CheckoutHeader } from "../CheckoutHeader";
import { PaymentSection } from "../PaymentSection";
import { OrderSummarySection } from "../OrderSummarySection";
import { SectionDivider } from "../SectionDevider";
import { useCheckout } from "@/src/hooks/orders/useCheckout";
import { useAddresses } from "@/src/hooks/address/useAdresses";
import { DeliveryTimeSection } from "../DeliveryTimeSection";
import { DeliveryAddressSection } from "../DeliveryAddressSection";
import { OrderSuccessToast } from "../../common/OrderSuccessToast";
import { GuestBillingForm, isGuestBillingValid } from "../GuestBillingForm";
import type { BillingInfo, OrderSummary } from "@/src/types/order/checkout";
import { useAuth } from "@/src/contexts/AuthContext";
import { useLocation } from "@/src/contexts/LocationContext";
import { apiRequest } from "@/src/lib/shared/apiClient";
import { setToken } from "@/src/lib/shared/tokenServices";
import AddressForm from "../../settings/addresses/AdressForm";
import { PlaceOrderError } from "../PlaceOrderError";
import { usePathname } from "@/src/i18n/navigation";

// ─── Types ────────────────────────────────────────────────────

type InitialSummary = Omit<
  OrderSummary,
  "delivery" | "tip" | "promoDiscount" | "currency"
>;

interface CheckoutClientProps {
  initialSummary: InitialSummary;
  onBack?: () => void;
}

// ─── Skeleton ─────────────────────────────────────────────────

function AddressSectionSkeleton() {
  return (
    <div className="flex flex-col gap-3 py-4 animate-pulse">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl h-16"
          style={{ backgroundColor: "var(--color-bg-subtle, #f3f4f6)" }}
        />
      ))}
    </div>
  );
}

// ─── Guest Login Banner ───────────────────────────────────────

function GuestLoginBanner() {
  const t = useTranslations("checkout");
  const pathname = usePathname();

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 my-3"
      style={{
        backgroundColor: "var(--color-bg-subtle, #f3f4f6)",
        border: "1px solid var(--color-border)",
      }}
    >
      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
        {t("guestLoginPrompt")}
      </p>
      <Link
        href={`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`}
        className="shrink-0 text-sm font-semibold underline underline-offset-2"
        style={{ color: "var(--color-primary)" }}
      >
        {t("guestLoginCta")}
      </Link>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────

export function CheckoutClient({
  initialSummary,
  onBack,
}: CheckoutClientProps) {
  const router = useRouter();
  const t = useTranslations("checkout");

  // ── Auth ──────────────────────────────────────────────────
  const { user, loading: authLoading } = useAuth();
  const { confirmLocation } = useLocation();
  const isGuest = !authLoading && !user;
  const isLoggedIn = !authLoading && !!user;
  const [showAddForm, setShowAddForm] = useState(false);

  // ── Addresses ─────────────────────────────────────────────
  const {
    addresses,
    isLoading: addressesLoading,
    isFetching: addressesFetching,
  } = useAddresses();

  const addressesBusy = addressesLoading || addressesFetching;
  const hasNoAddresses = isLoggedIn && !addressesBusy && addresses.length === 0;
  const hasAddresses = isLoggedIn && !addressesBusy && addresses.length > 0;

  // ── Checkout ──────────────────────────────────────────────
  const checkout = useCheckout();
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const orderSuccess = !!orderCode;

  // Auto-select default address once loaded / after refetch
  useEffect(() => {
    if (!hasAddresses) return;

    const defaultAddr =
      addresses.find((a) => a.set_default === 1) ?? addresses[0];

    if (
      checkout.selectedAddressId === null ||
      !addresses.find((a) => a.id === checkout.selectedAddressId)
    ) {
      checkout.setSelectedAddressId(defaultAddr.id);
      void confirmLocation(
        { lat: defaultAddr.lat, lng: defaultAddr.lang },
        defaultAddr.address,
      );
    }
  }, [hasAddresses, addresses.length]);

  // ── Address change handler ────────────────────────────────
  const handleAddressChange = useCallback(
    async (id: number) => {
      checkout.setSelectedAddressId(id);
      const addr = addresses.find((a) => a.id === id);
      if (addr) {
        await confirmLocation({ lat: addr.lat, lng: addr.lang }, addr.address);
      }
    },
    [addresses, checkout, confirmLocation],
  );

  // ── Delivery cost ─────────────────────────────────────────
  const selectedAddress = addresses.find(
    (a) => a.id === checkout.selectedAddressId,
  );
  const delivery =
    selectedAddress?.district_cost ??
    selectedAddress?.city_cost ??
    selectedAddress?.state_cost ??
    selectedAddress?.country_cost ??
    0;

  const summary: OrderSummary = {
    ...initialSummary,
    delivery,
    tip: 0,
    promoDiscount: 0,
    currency: "EGP",
  };

  // ── canPlaceOrder ─────────────────────────────────────────
  const canPlaceOrder = (() => {
    if (authLoading || addressesBusy) return false;
    if (!checkout.selectedSlotId) return false;
    if (isGuest) return isGuestBillingValid(checkout.billing);
    return checkout.selectedAddressId !== null;
  })();

  // ── Guest auto-login ──────────────────────────────────────
  const autoLoginGuest = async (billing: Partial<BillingInfo>) => {
    try {
      const response = await apiRequest("/api/v2/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: billing.phone ?? billing.email,
          password: billing.account_Password,
          login_by: billing.phone ? "phone" : "email",
          user_type: "customer",
        }),
      });
      const data = await response.json();
      if (response.ok && data.access_token) {
        setToken(data.access_token);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("userLoggedIn"));
        }
      }
    } catch {
      // best-effort — order already succeeded
    }
  };

  // ── Place order ───────────────────────────────────────────
  const handlePlaceOrder = async () => {
    try {
      let code: string | null = null;

      if (isGuest) {
        code = await checkout.placeOrder({
          billing: checkout.billing as BillingInfo,
        });
        await autoLoginGuest(checkout.billing);
      } else {
        code = await checkout.placeOrder();
      }

      // Use the value returned directly from mutateAsync — don't rely on
      // checkout.orderCode state which may not have flushed yet
      setOrderCode(code);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch {
      // error stored in checkout.placeOrderError
    }
  };

  // ── Address section ───────────────────────────────────────
  const addressSection = (() => {
    if (authLoading || (isLoggedIn && addressesBusy)) {
      return <AddressSectionSkeleton />;
    }

    if (isGuest) {
      return (
        <div>
          <GuestLoginBanner />
          <p
            className="text-base font-semibold mb-1 mt-4"
            style={{
              color: "var(--color-text)",
              fontFamily: "var(--font-display)",
            }}
          >
            {t("guestCheckout")}
          </p>
          <p
            className="text-sm mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {t("guestCheckoutDescription")}
          </p>
          <GuestBillingForm
            value={checkout.billing}
            onChange={checkout.setBilling}
          />
        </div>
      );
    }

    if (hasNoAddresses) {
      return (
        <div>
          <p
            className="text-base font-semibold mb-1 mt-2"
            style={{
              color: "var(--color-text)",
              fontFamily: "var(--font-display)",
            }}
          >
            {t("addFirstAddress")}
          </p>
          <p
            className="text-sm mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {t("addFirstAddressDescription")}
          </p>
          <AddressForm onSaved={() => {}} />
        </div>
      );
    }

    return (
      <div>
        <DeliveryAddressSection
          addresses={addresses}
          isLoading={addressesBusy}
          selectedAddressId={checkout.selectedAddressId}
          onAddressChange={handleAddressChange}
          deliveryNote={checkout.orderNote}
          onNoteChange={checkout.setOrderNote}
        />

        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-150 mb-4"
          style={{
            border: "1.5px dashed var(--color-primary)",
            color: "var(--color-primary)",
            backgroundColor: showAddForm
              ? "var(--color-primary-light)"
              : "transparent",
            fontFamily: "var(--font-sans)",
          }}
        >
          <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>
            {showAddForm ? "−" : "+"}
          </span>
          {showAddForm ? t("cancel") : t("addNewAddress")}
        </button>

        {showAddForm && (
          <AddressForm
            onSaved={() => {
              checkout.setSelectedAddressId(null);
              setShowAddForm(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </div>
    );
  })();

  const deliveryTimeSection = (
    <DeliveryTimeSection
      instantSlot={checkout.instantSlot}
      todaySlots={checkout.todaySlots}
      upcomingDays={checkout.upcomingDays}
      selectedScheduleDay={checkout.selectedScheduleDay}
      onScheduleDayChange={checkout.setSelectedScheduleDay}
      selectedSlotId={checkout.selectedSlotId}
      onSlotChange={checkout.setSelectedSlotId}
    />
  );

  const paymentSection = <PaymentSection selected="cash" onChange={() => {}} />;

  const errorBanner =
    checkout.placeOrderError && !orderSuccess ? (
      <PlaceOrderError message={checkout.placeOrderError} />
    ) : null;

  return (
    <div
      className="min-h-dvh pb-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <CheckoutHeader onBack={onBack} />

      {/* ── MOBILE ── */}
      <div className="md:hidden px-4">
        {deliveryTimeSection}
        <SectionDivider />
        {addressSection}
        <SectionDivider />
        {paymentSection}
        <SectionDivider />
        {errorBanner && <div className="pt-2 pb-1">{errorBanner}</div>}
        <OrderSummarySection
          summary={summary}
          onPlaceOrder={handlePlaceOrder}
          isLoading={checkout.isPlacing}
          canPlaceOrder={canPlaceOrder}
        />
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block max-w-5xl mx-auto px-6 lg:px-8 pt-8">
        <h1
          className="text-2xl font-bold mb-8"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
          }}
        >
          {t("checkout")}
        </h1>
        <div className="flex gap-8 items-start">
          <div
            className="flex-1 min-w-0 rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--color-border)" }}
          >
            <div className="px-6">{deliveryTimeSection}</div>
            <SectionDivider />
            <div className="px-6">{addressSection}</div>
            <SectionDivider />
            <div className="px-6">{paymentSection}</div>
          </div>

          {/* Sticky sidebar — error at top, above totals and button */}
          <div
            className="w-80 xl:w-96 shrink-0 sticky top-24 rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--color-border)" }}
          >
            <div className="px-6">
              {errorBanner && <div className="pt-4">{errorBanner}</div>}
              <OrderSummarySection
                summary={summary}
                onPlaceOrder={handlePlaceOrder}
                isLoading={checkout.isPlacing}
                canPlaceOrder={canPlaceOrder}
              />
            </div>
          </div>
        </div>
      </div>

      <OrderSuccessToast
        visible={orderSuccess}
        orderCode={orderCode}
        duration={3000}
      />
    </div>
  );
}
