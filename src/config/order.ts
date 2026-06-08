// src/configs/order.ts
import { OrderSummary, OrderDetail, OrderItem } from '../types/order/order';

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type OrderFilter = 'all' | 'active' | 'completed' | 'cancelled';

export const FILTER_TABS: { id: OrderFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
  pending: { 
    label: 'Pending', 
    color: '#b45309', 
    bgColor: '#fffbeb' 
  },
  confirmed: { 
    label: 'Confirmed', 
    color: '#1e40af', 
    bgColor: '#eff6ff' 
  },
  processing: { 
    label: 'Processing', 
    color: '#854d0e', 
    bgColor: '#fef9c3' 
  },
  out_for_delivery: { 
    label: 'Out for Delivery', 
    color: '#166534', 
    bgColor: '#dcfce7' 
  },
  delivered: { 
    label: 'Delivered', 
    color: '#065f46', 
    bgColor: '#ecfdf5' 
  },
  cancelled: { 
    label: 'Cancelled', 
    color: '#991b1b', 
    bgColor: '#fef2f2' 
  },
};

// Map API status to our UI status
export function mapApiStatus(apiStatus: string): OrderStatus {
  const statusMap: Record<string, OrderStatus> = {
    'pending': 'pending',
    'confirmed': 'confirmed',
    'processing': 'processing',
    'preparing': 'processing',
    'out_for_delivery': 'out_for_delivery',
    'shipped': 'out_for_delivery',
    'delivered': 'delivered',
    'cancelled': 'cancelled',
  };
  return statusMap[apiStatus?.toLowerCase()] || 'pending';
}

export interface UIOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  statusText: string;
  items: UIOrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  couponDiscount: number;
  grandTotal: number;
  currency: string;
  paymentType: string;
  paymentStatus: string;
  paymentStatusText: string;
  deliveryAddress?: string;
  canCancel: boolean;
  canReorder: boolean;
  canRate: boolean;
}

export interface UIOrderItem {
  id: string;
  productId: number;
  name: string;
  variation?: string;
  quantity: number;
  price: number;
  total: number;
  imageUrl?: string;
  deliveryStatus: string;
  deliveryStatusText: string;
  canRefund: boolean;
  refundRequestStatus: number;
}

// Transform order summary to UI format
export function transformOrderSummary(summary: OrderSummary): UIOrder {
  return {
    id: summary.id.toString(),
    orderNumber: summary.code,
    date: summary.date,
    status: mapApiStatus(summary.delivery_status),
    statusText: summary.delivery_status_string,
    items: [], // Will be populated when fetching details
    subtotal: 0, // Not in summary
    shippingCost: 0, // Not in summary
    tax: 0, // Not in summary
    couponDiscount: 0, // Not in summary
    grandTotal: summary.grand_total,
    currency: 'EGP', // You might want to get this from a settings context
    paymentType: summary.payment_type,
    paymentStatus: summary.payment_status,
    paymentStatusText: summary.payment_status_string,
    canCancel: !['delivered', 'cancelled'].includes(summary.delivery_status?.toLowerCase()),
    canReorder: true,
    canRate: summary.delivery_status?.toLowerCase() === 'delivered',
  };
}

// Transform order detail + items to UI format
export function transformOrderDetail(detail: OrderDetail, items: OrderItem[]): UIOrder {
  let shippingAddress: any = {};
  if (typeof detail.shipping_address === 'string') {
    try {
      shippingAddress = JSON.parse(detail.shipping_address);
    } catch (e) {
      shippingAddress = {};
    }
  } else {
    shippingAddress = detail.shipping_address;
  }

  const addressString = shippingAddress 
    ? `${shippingAddress.address || ''}, ${shippingAddress.city || ''}, ${shippingAddress.state || ''}`
    : '';

  return {
    id: detail.id.toString(),
    orderNumber: detail.code,
    date: detail.date,
    status: mapApiStatus(detail.delivery_status),
    statusText: detail.delivery_status_string,
    items: items.map(item => ({
      id: item.id.toString(),
      productId: item.product_id,
      name: item.product_name,
      variation: item.variation,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
      imageUrl: item.product?.thumbnail_image,
      deliveryStatus: item.delivery_status,
      deliveryStatusText: item.delivery_status_string,
      canRefund: item.refund_section && item.refund_button,
      refundRequestStatus: item.refund_request_status,
    })),
    subtotal: detail.subtotal,
    shippingCost: detail.shipping_cost,
    tax: detail.tax,
    couponDiscount: detail.coupon_discount,
    grandTotal: detail.grand_total,
    currency: 'EGP',
    paymentType: detail.payment_type,
    paymentStatus: detail.payment_status,
    paymentStatusText: detail.payment_status_string,
    deliveryAddress: addressString,
    canCancel: detail.cancel_request === false && 
               !['delivered', 'cancelled'].includes(detail.delivery_status?.toLowerCase()),
    canReorder: true,
    canRate: detail.delivery_status?.toLowerCase() === 'delivered',
  };
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  console.log('Date:', date, 'Now:', now);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}