"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SlideCard from "./SlideCard";
import { SlidersModal } from "./SlidersModal";
import { useTranslations } from "next-intl";
import { useSlider } from "@/src/hooks/home/useSliders";

const AUTOPLAY_MS = 4000;

export function PromoSlider() {
  const [active, setActive] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const t = useTranslations("home");

  const { banners: slides, isLoading, isError } = useSlider();

  const startTimer = useCallback(() => {
    if (!slides.length) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
  }, [slides.length]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const goTo = (idx: number) => {
    setActive(idx);
    startTimer();
  };

  const touchStartX = useRef<number>(0);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      goTo(
        dx < 0
          ? (active + 1) % slides.length
          : (active - 1 + slides.length) % slides.length,
      );
    }
  };

  if (isLoading)
    return (
      <div className="-mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-2">
        <div className="promo-slider relative overflow-hidden rounded-2xl bg-gray-100 animate-pulse">
          <style>{`
            .promo-slider { aspect-ratio: 16/7; }
            @media (min-width: 768px) { .promo-slider { aspect-ratio: 16/5; } }
          `}</style>
        </div>
      </div>
    );

  if (isError || !slides.length) return null;

  return (
    <>
      <div className="-mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-2">
        <div
          className="promo-slider relative overflow-hidden rounded-2xl"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <style>{`
            .promo-slider { aspect-ratio: 16/7; }
            @media (min-width: 768px) { .promo-slider { aspect-ratio: 16/5; } }
          `}</style>

          {slides.map((slide, idx) => (
            <SlideCard
              key={slide.photo}
              slide={slide}
              isActive={idx === active}
            />
          ))}

          {/* View All button — top right */}
       {/*    <button
            onClick={() => setModalOpen(true)}
            className="absolute top-3 end-4 z-20 text-xs font-semibold px-3 py-1.5 rounded-full
                        hover:bg-white shadow transition-all duration-200 hover:scale-105"
            style={{
              color: "var(--color-primary)",
              fontFamily: "var(--font-sans)",
              backgroundColor: "var(--color-bg-subtle)",
            }}
          >
            {t("viewAll")}
          </button> */}

          {/* Dot indicators — bottom right */}
          <div className="absolute bottom-3 right-4 flex gap-1.5 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                aria-label={t("slider.goToSlide", { number: idx + 1 })}
                className="flex items-center justify-center p-1.5 -m-1.5"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <span
                  className="block transition-all duration-300"
                  style={{
                    width: idx === active ? "20px" : "6px",
                    height: "6px",
                    borderRadius: "9999px",
                    backgroundColor:
                      idx === active ? "#ffffff00" : "rgba(255,255,255,0.45)",
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {modalOpen && <SlidersModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
