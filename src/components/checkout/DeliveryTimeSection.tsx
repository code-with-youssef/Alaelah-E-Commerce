"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { ClockIcon, XMarkIcon, BoltIcon } from "@heroicons/react/24/outline";
import type { DeliverySlot } from "@/src/types/order/checkout";
import type { SlotTab } from "@/src/hooks/orders/useCheckout";

interface DeliveryTimeSectionProps {
  // Today tab
  instantSlot: DeliverySlot;
  todaySlots: DeliverySlot[];
  // Schedule tab
  upcomingDays: { dateKey: string; label: string; slots: DeliverySlot[] }[];
  selectedScheduleDay: string;
  onScheduleDayChange: (key: string) => void;
  // Selection
  selectedSlotId: string;
  onSlotChange: (id: string) => void;
}

export function DeliveryTimeSection({
  instantSlot,
  todaySlots,
  upcomingDays,
  selectedScheduleDay,
  onScheduleDayChange,
  selectedSlotId,
  onSlotChange,
}: DeliveryTimeSectionProps) {
  const t = useTranslations('checkout');
  const [modalOpen, setModalOpen] = useState(false);

  const selectedLabel = resolveLabel(selectedSlotId, instantSlot, todaySlots, upcomingDays, t);

  return (
    <>
      <section className="py-5">
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
          >
            {t('deliveryTime')}
          </h2>
          <button
            onClick={() => setModalOpen(true)}
            className="text-sm font-semibold"
            style={{ color: "var(--color-primary)", fontFamily: "var(--font-sans)" }}
          >
            {t('schedule')}
          </button>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-3 w-full text-left"
        >
          <ClockIcon className="w-5 h-5 shrink-0" style={{ color: "var(--color-text-muted)" }} />
          <span
            className="text-sm font-medium"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-text)" }}
          >
            {selectedLabel}
          </span>
        </button>
      </section>

      {modalOpen && (
        <DeliveryTimeModal
          instantSlot={instantSlot}
          todaySlots={todaySlots}
          upcomingDays={upcomingDays}
          selectedScheduleDay={selectedScheduleDay}
          onScheduleDayChange={onScheduleDayChange}
          selectedSlotId={selectedSlotId}
          onSelect={(id) => { onSlotChange(id); setModalOpen(false); }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────

function resolveLabel(
  id: string,
  instant: DeliverySlot,
  today: DeliverySlot[],
  upcoming: { dateKey: string; label: string; slots: DeliverySlot[] }[],
  t: any
): string {
  if (id === "instant") return t('instantDelivery');
  const todayMatch = today.find((s) => s.id === id);
  if (todayMatch) return t('todayLabel', { time: todayMatch.label });
  for (const day of upcoming) {
    const match = day.slots.find((s) => s.id === id);
    if (match) return t('scheduleLabel', { day: day.label, time: match.label });
  }
  return t('selectTime');
}

// ── Modal ─────────────────────────────────────────────────────

interface ModalProps {
  instantSlot: DeliverySlot;
  todaySlots: DeliverySlot[];
  upcomingDays: { dateKey: string; label: string; slots: DeliverySlot[] }[];
  selectedScheduleDay: string;
  onScheduleDayChange: (key: string) => void;
  selectedSlotId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

function DeliveryTimeModal(props: ModalProps) {
  const t = useTranslations('checkout');
  const [activeTab, setActiveTab] = useState<SlotTab>(
    props.selectedSlotId === "instant" || props.selectedSlotId.startsWith("today-")
      ? "today"
      : "schedule"
  );

  const content = <ModalContent {...props} activeTab={activeTab} onTabChange={setActiveTab} />;

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/40" onClick={props.onClose} aria-hidden="true" />

      {/* Mobile — bottom sheet */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-[101] rounded-t-3xl overflow-hidden flex flex-col"
        style={{ backgroundColor: "var(--color-bg)", maxHeight: "90dvh" }}
        role="dialog"
        aria-label={t('selectDeliveryTime')}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "var(--color-border)" }} />
        </div>
        {content}
      </div>

      {/* Desktop — centered modal */}
      <div className="hidden md:flex fixed inset-0 z-[101] items-center justify-center p-6" aria-modal="true">
        <div
          className="w-full max-w-md rounded-3xl overflow-hidden flex flex-col shadow-2xl"
          style={{ backgroundColor: "var(--color-bg)", maxHeight: "80dvh" }}
          role="dialog"
          aria-label={t('selectDeliveryTime')}
        >
          {content}
        </div>
      </div>
    </>
  );
}

// ── Modal content ─────────────────────────────────────────────

interface ModalContentProps extends ModalProps {
  activeTab: SlotTab;
  onTabChange: (tab: SlotTab) => void;
}

function ModalContent({
  instantSlot,
  todaySlots,
  upcomingDays,
  selectedScheduleDay,
  onScheduleDayChange,
  selectedSlotId,
  onSelect,
  onClose,
  activeTab,
  onTabChange,
}: ModalContentProps) {
  const t = useTranslations('checkout');
  
  return (
    <>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <h3
          className="text-lg font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
        >
          {t('selectDeliveryTime')}
        </h3>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--color-bg-muted)", color: "var(--color-text-muted)" }}
          aria-label={t('close')}
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex px-5 pt-4 gap-2 shrink-0"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        {(["today", "schedule"] as SlotTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className="pb-3 px-1 text-sm font-semibold capitalize transition-colors relative"
            style={{
              fontFamily: "var(--font-sans)",
              color: activeTab === tab ? "var(--color-primary)" : "var(--color-text-muted)",
            }}
          >
            {tab === "today" ? t('today') : t('schedule')}
            {activeTab === tab && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ backgroundColor: "var(--color-primary)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Scrollable list */}
      <div className="overflow-y-auto flex-1 px-5 py-5">
        {activeTab === "today" ? (
          <TodayTabContent
            instantSlot={instantSlot}
            todaySlots={todaySlots}
            selectedSlotId={selectedSlotId}
            onSelect={onSelect}
          />
        ) : (
          <ScheduleTabContent
            upcomingDays={upcomingDays}
            selectedScheduleDay={selectedScheduleDay}
            onScheduleDayChange={onScheduleDayChange}
            selectedSlotId={selectedSlotId}
            onSelect={onSelect}
          />
        )}
      </div>
    </>
  );
}

// ── Today tab ─────────────────────────────────────────────────

function TodayTabContent({
  instantSlot,
  todaySlots,
  selectedSlotId,
  onSelect,
}: {
  instantSlot: DeliverySlot;
  todaySlots: DeliverySlot[];
  selectedSlotId: string;
  onSelect: (id: string) => void;
}) {
  const t = useTranslations('checkout');
  
  return (
    <>
      {/* Instant slot */}
      <button
        onClick={() => onSelect(instantSlot.id)}
        className="w-full flex items-center justify-between px-5 py-4 rounded-2xl mb-5 relative overflow-hidden transition-all"
        style={{
          border: selectedSlotId === instantSlot.id
            ? "2px solid var(--color-primary)"
            : "1.5px solid var(--color-border)",
          backgroundColor: selectedSlotId === instantSlot.id
            ? "var(--color-primary-light)"
            : "var(--color-bg)",
        }}
      >
        <BoltIcon
          className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 w-14 h-14"
          style={{ color: "var(--color-primary)" }}
        />
        <span
          className="text-base font-bold relative z-10"
          style={{ fontFamily: "var(--font-sans)", color: "var(--color-text)" }}
        >
          {t('instant')}
        </span>
        <RadioDot selected={selectedSlotId === instantSlot.id} />
      </button>

      {/* Hourly slots */}
      {todaySlots.length > 0 ? (
        <>
          <h4
            className="text-base font-bold mb-3"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
          >
            {t('orPickTimeToday')}
          </h4>
          <div className="flex flex-col gap-2 pb-4">
            {todaySlots.map((slot) => (
              <SlotRow
                key={slot.id}
                slot={slot}
                selected={selectedSlotId === slot.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </>
      ) : (
        <p
          className="text-sm text-center py-4"
          style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
        >
          {t('noMoreSlotsToday')}
        </p>
      )}
    </>
  );
}

// ── Schedule tab ──────────────────────────────────────────────

function ScheduleTabContent({
  upcomingDays,
  selectedScheduleDay,
  onScheduleDayChange,
  selectedSlotId,
  onSelect,
}: {
  upcomingDays: { dateKey: string; label: string; slots: DeliverySlot[] }[];
  selectedScheduleDay: string;
  onScheduleDayChange: (key: string) => void;
  selectedSlotId: string;
  onSelect: (id: string) => void;
}) {
  const t = useTranslations('checkout');
  const activeDayData =
    upcomingDays.find((d) => d.dateKey === selectedScheduleDay) ?? upcomingDays[0];

  return (
    <>
      {/*
        Day picker — horizontally scrollable on ALL screen sizes.
        - `overflow-x-auto`  : enables scroll
        - `flexWrap: nowrap` : prevents pills from wrapping to a new line
        - `scrollbarWidth`   : shows a thin scrollbar on desktop so mouse users
                               can discover the scroll affordance
        - `whiteSpace: nowrap` on each pill: prevents label text from breaking
      */}
      <div
        className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1"
        style={{
          flexWrap: "nowrap",
          scrollbarWidth: "thin",
          scrollbarColor: "var(--color-border) transparent",
        }}
      >
        {upcomingDays.map((day) => {
          const isActive = day.dateKey === selectedScheduleDay;
          return (
            <button
              key={day.dateKey}
              onClick={() => onScheduleDayChange(day.dateKey)}
              className="shrink-0 px-4 py-2 rounded-2xl text-sm font-semibold transition-all"
              style={{
                fontFamily: "var(--font-sans)",
                whiteSpace: "nowrap",
                border: isActive
                  ? "2px solid var(--color-primary)"
                  : "1.5px solid var(--color-border)",
                backgroundColor: isActive ? "var(--color-primary-light)" : "var(--color-bg)",
                color: isActive ? "var(--color-primary)" : "var(--color-text)",
              }}
            >
              {day.label}
            </button>
          );
        })}
      </div>

      {/* Slots sourced directly from props — built by deliverySlots.ts */}
      <div className="flex flex-col gap-2 pb-4">
        {activeDayData?.slots.map((slot) => (
          <SlotRow
            key={slot.id}
            slot={slot}
            selected={selectedSlotId === slot.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </>
  );
}

// ── Shared slot row ───────────────────────────────────────────

function SlotRow({
  slot,
  selected,
  onSelect,
}: {
  slot: DeliverySlot;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const t = useTranslations('checkout');
  
  return (
    <button
      onClick={() => onSelect(slot.id)}
      disabled={!slot.isAvailable}
      className="w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        border: selected
          ? "2px solid var(--color-primary)"
          : "1.5px solid var(--color-border)",
        backgroundColor: selected ? "var(--color-primary-light)" : "var(--color-bg)",
      }}
    >
      <span
        className="text-sm font-medium"
        style={{ fontFamily: "var(--font-sans)", color: "var(--color-text)" }}
      >
        {slot.label}
      </span>
      <RadioDot selected={selected} />
    </button>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div
      className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
      style={{ borderColor: selected ? "var(--color-primary)" : "var(--color-border)" }}
    >
      {selected && (
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--color-primary)" }} />
      )}
    </div>
  );
}