export interface SavedAddress {
  id: number;
  label: string;
  full_address: string;
  lat?: number;
  lng?: number;
}

export interface SavedCard {
  id: number;
  last4: string;
  brand: "visa" | "mastercard" | "amex" | "other";
  expiry: string;
  label?: string;
}

export interface PersonalInfo {
  first_name: string;
  last_name: string;
  phone_country_code: string;
  phone_number: string;
}

export interface NotificationSettings {
  push_notifications: boolean;
  sms_notifications: boolean;
  email_notifications: boolean;
  promotional: boolean;
}

export interface AddCardFormData {
  card_number: string;
  expiry_date: string;
  cvv: string;
  cardholder_name: string;
  email: string;
  label?: string;
}