// app/orders/components/OrdersClient.tsx
"use client";

import { useState, useMemo } from "react";
import { OrdersHeader } from "../OrdersHeader";
import { FilterTabs } from "../FilterTabs";
import { OrderCard } from "../OrderCard";
import { OrderDetailSheet } from "../OrderDetailSheet";
import { ActiveOrderBanner } from "../ActiveOrderBanner";
import { EmptyState } from "../EmptyState";
import { transformOrderSummary, transformOrderDetail, UIOrder } from "@/src/config/order";
import type { OrderFilter } from "@/src/config/order";
import { useOrderDetail, useOrderItems, useOrders } from "@/src/hooks/orders/useOrders";
import { useTranslations } from "next-intl";

interface OrdersClientProps {
  initialPage?: number;
  onReorder?: (orderId: string) => void;
  onRate?: (orderId: string, rating: number) => void;
  onBack?: () => void;
  showBack?: boolean;
}

export function OrdersClient({
  initialPage = 1,
  onReorder,
  onRate,
  onBack,
  showBack = false,
}: OrdersClientProps) {
  const t = useTranslations("orders");
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);

  // Fetch orders
  const { 
    data: ordersData, 
    isLoading, 
    error 
  } = useOrders(page, 10);

  // Fetch selected order details
  const { data: orderDetailData } = useOrderDetail(
    selectedOrderId ? parseInt(selectedOrderId) : undefined
  );
  
  const { data: orderItemsData } = useOrderItems(
    selectedOrderId ? parseInt(selectedOrderId) : undefined
  );

  // Transform orders to UI format
  const allOrders: UIOrder[] = useMemo(() => {
    if (!ordersData?.data) return [];
    return ordersData.data.map(transformOrderSummary);
  }, [ordersData]);

  // Transform selected order details
  const selectedOrder = useMemo(() => {
    if (!orderDetailData?.data?.[0] || !orderItemsData?.data) return null;
    return transformOrderDetail(orderDetailData.data[0], orderItemsData.data);
  }, [orderDetailData, orderItemsData]);

  // Active (in-progress) orders
  const activeOrder = useMemo(
    () => allOrders.find((o) => 
      ['pending', 'confirmed', 'processing', 'out_for_delivery'].includes(o.status)
    ),
    [allOrders],
  );

  // Filter orders based on active filter
  const filteredOrders = useMemo(() => {
    if (activeFilter === 'all') return allOrders;
    if (activeFilter === 'active') {
      return allOrders.filter(o => 
        ['pending', 'confirmed', 'processing', 'out_for_delivery'].includes(o.status)
      );
    }
    if (activeFilter === 'completed') {
      return allOrders.filter(o => o.status === 'delivered');
    }
    if (activeFilter === 'cancelled') {
      return allOrders.filter(o => o.status === 'cancelled');
    }
    return allOrders;
  }, [allOrders, activeFilter]);

  // Counts for tabs
  const counts = useMemo(() => ({
    active: allOrders.filter(o => 
      ['pending', 'confirmed', 'processing', 'out_for_delivery'].includes(o.status)
    ).length,
    completed: allOrders.filter(o => o.status === 'delivered').length,
    cancelled: allOrders.filter(o => o.status === 'cancelled').length,
  }), [allOrders]);

  const handleLoadMore = () => {
    if (ordersData && page < ordersData.total_pages) {
      setPage(prev => prev + 1);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">{t("failedToLoadOrders")}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--color-bg-subtle, #f8f8f8)", minHeight: "100vh" }}>
      <OrdersHeader onBack={onBack} showBack={showBack} />

      {/* Desktop title */}
      <div className="hidden md:block px-6 lg:px-8 pt-8 pb-4 max-w-4xl mx-auto">
        <h1
          className="text-2xl font-bold"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
          }}
        >
          {t("myOrders")}
        </h1>
      </div>

      {/* Active order banner */}

      {/* Filter tabs */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 pt-4">
        <FilterTabs
          active={activeFilter}
          onChange={setActiveFilter}
          counts={counts}
        />
      </div>

      {/* Orders list */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-4">
        {isLoading && page === 1 ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => setSelectedOrderId(order.id)}
                  onReorder={onReorder}
                  onRate={onRate}
                />
              ))}
            </div>
            
            {/* Load more */}
            {ordersData && page < ordersData.total_pages && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-6 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                  style={{ color: "var(--color-primary)" }}
                >
                  {isLoading ? t("loading") : t("loadMore")}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order detail sheet */}
      {selectedOrder && (
        <OrderDetailSheet
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
          onReorder={onReorder}
        />
      )}
    </div>
  );
}