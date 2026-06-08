// ─── API Request Body ─────────────────────────────────────────

export type CheckoutPaymentType = "cashOnDelivery";

// ─── Billing Info — guest checkout only ───────────────────────
// All fields shown; used when the user is unauthenticated.

export interface BillingInfo {
  // Address
  name: string;
  address: string;
  longitude: string;
  latitude: string;
  state_Id: number;
  city_Id: number;
  district_Id: number;
  building_Number: string;
  floor?: string;
  room?: string;
  street?: string;
  // Personal info
  phone: string;
  phone2?: string;
  email?: string;
  account_Password: string;
}

export interface PlaceOrderBody {
  payment_method: CheckoutPaymentType;
  /** present when the user has a saved address selected */
  selected_address?: number;
  delivered_date: string; // ISO 8601
  additional_info?: string;
  order_note?: string;
  /** present for guest checkout only */
  billing?: BillingInfo;
}

// ─── Form State ───────────────────────────────────────────────

export interface CheckoutFormState {
  paymentMethod: CheckoutPaymentType;
  selectedAddressId: number | null;
  deliveredDate: Date | null;
  additionalInfo?: string;
  orderNote?: string;
}

// ─── Delivery Slot ────────────────────────────────────────────

export type SlotDay = "today" | string;

export interface DeliverySlot {
  id: string;
  label: string;
  date: Date;
  isInstant: boolean;
  isAvailable: boolean;
}

export type PaymentMethod = "cash" | "card";

export interface PaymentOption {
  id: PaymentMethod;
  label: string;
  icon: "cash" | "card";
}

// ─── Order Summary ────────────────────────────────────────────

export interface OrderSummary {
  subtotal: number;
  delivery: number;
  serviceFee: number;
  tip: number;
  promoDiscount: number;
  currency: string;
  pointsEarned: number;
}

export function calcGrandTotal(s: OrderSummary): number {
  return s.subtotal + s.delivery + s.serviceFee + s.tip - s.promoDiscount;
}