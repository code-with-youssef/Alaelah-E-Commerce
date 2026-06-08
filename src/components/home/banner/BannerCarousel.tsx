"use client";

import { useCallback, useRef, useState } from "react";
import { useBanners } from "@/src/hooks/home/useBanners";
import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Banner } from "@/src/types/home/banner";
import { BannersModal } from "./BannersModal";
import { resolveBannerUrl } from "@/src/utils/bannerUrlResolver";


function useBannerLinkUrl(rawUrl: string | undefined): string {
  const patternUrl = resolveBannerUrl(rawUrl);          // null → no pattern matched
  const resolvedUrl = useResolvedUrl(rawUrl ?? null);   // storage-base fallback

  return patternUrl ?? resolvedUrl ?? "#";
}

function BannerImage({ banner, t }: { banner: Banner; t: any }) {
  // Photo src: always goes through useResolvedUrl (storage base-URL, CDN, etc.)
  const photoUrl = useResolvedUrl(banner.photo);

  // Link href: pattern resolver first, storage resolver as fallback
  const linkUrl = useBannerLinkUrl(banner.url);

  return (
    <a
      href={linkUrl}
      // Internal routes stay in the same tab; external URLs open a new tab
      target={linkUrl.startsWith("http") ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="flex-1 min-w-0 relative block aspect-[4/3] sm:aspect-[6/3]"
      draggable={false}
      aria-label={t("slider.slideLinkAlt")}
    >
      <img
        src={photoUrl}
        alt={t("slider.slideImageAlt")}
        className="absolute inset-0 w-full h-full object-full rounded-xl"
        draggable={false}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/default.png";
        }}
      />
    </a>
  );
}

// ─── Fetch a single banner group's data ─────────────────────────────────────
function useBannerSlide(bannerNumber: number) {
  return useBanners(bannerNumber);
}

// ─── Wrapper to collect all banner data at the top level ────────────────────
function useAllBanners() {
  const b1 = useBannerSlide(1);
  const b2 = useBannerSlide(2);
  const b3 = useBannerSlide(3);

  const all = [b1, b2, b3];
  const isLoading = all.some((b) => b.isLoading);

  const activeBanners = all
    .map((b, i) => ({ banners: b.banners, index: i }))
    .filter(({ banners }) => banners && banners.length > 0);

  return { activeBanners, isLoading };
}

// ─── Main carousel ───────────────────────────────────────────────────────────
export function BannerCarousel() {
  const [active, setActive] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const t = useTranslations("home");
  const touchStartX = useRef<number>(0);

  const { activeBanners, isLoading } = useAllBanners();
  const total = activeBanners.length;

  const prev = useCallback(
    () => setActive((p) => (p - 1 + total) % total),
    [total],
  );
  const next = useCallback(() => setActive((p) => (p + 1) % total), [total]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
  };

  if (isLoading || total === 0) return null;

  const currentSlide = activeBanners[active];
  const hasMultipleImages = currentSlide?.banners?.length > 1;
  const showArrows = total > 1;
  const showDots = total > 1;

  return (
    <>
      <div
        className="relative group w-full"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* View All button */}
        <div className="flex justify-end mb-1.5 pe-1">
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs font-semibold px-2.5 py-1 rounded-full
                       shadow transition-all duration-200 hover:scale-105 cursor-pointer"
            style={{
              color: "var(--color-primary)",
              fontFamily: "var(--font-sans)",
              backgroundColor: "var(--color-bg-subtle)",
            }}
          >
            {t("viewAll")}
          </button>
        </div>

        {/* Slide container */}
        <div className="relative overflow-hidden rounded-2xl w-full">
          <div
            className={
              hasMultipleImages
                ? "aspect-[12/3] sm:aspect-[16/6] md:aspect-[16/5] lg:aspect-[16/3] w-full"
                : "aspect-[16/7] sm:aspect-[16/6] md:aspect-[16/4] lg:aspect-[16/3.5] w-full"
            }
          >
            {activeBanners.map(({ banners, index }, slideIdx) => {
              const isMulti = banners.length > 1;
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                    slideIdx === active
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0 pointer-events-none"
                  } ${isMulti ? "flex flex-row gap-1.5 p-1.5" : "flex"}`}
                >
                  {banners.map((banner, idx) => (
                    <BannerImage key={idx} banner={banner} t={t} />
                  ))}
                </div>
              );
            })}
          </div>

          {/* Dot indicators */}
          {showDots && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {activeBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Go to banner ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? "w-5 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Navigation arrows */}
        {showArrows && (
          <>
            <button
              onClick={prev}
              aria-label="Previous banner"
              className="
                absolute left-2 top-1/2 -translate-y-1/2 z-20
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                flex items-center justify-center
                w-7 h-7 md:w-10 md:h-10 rounded-full
                bg-white/90 hover:bg-white shadow-lg
                hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300
              "
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-800" />
            </button>

            <button
              onClick={next}
              aria-label="Next banner"
              className="
                absolute right-2 top-1/2 -translate-y-1/2 z-20
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                flex items-center justify-center
                w-7 h-7 md:w-10 md:h-10 rounded-full
                bg-white/90 hover:bg-white shadow-lg
                hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300
              "
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-800" />
            </button>
          </>
        )}
      </div>

      {modalOpen && <BannersModal onClose={() => setModalOpen(false)} />}
    </>
  );
}