"use client";

import { useTranslations } from "next-intl";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useBanners } from "@/src/hooks/home/useBanners";
import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";
import { Banner } from "@/src/types/home/banner";

interface BannersModalProps {
  onClose: () => void;
}

function ModalBannerImage({ banner, t }: { banner: Banner; t: any }) {
  const photoUrl = useResolvedUrl(banner.photo);
  const linkUrl = useResolvedUrl(banner.url);

  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      aria-label={t("slider.slideLinkAlt")}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="relative w-full overflow-hidden rounded-2xl bg-gray-50">
        <img
          src={photoUrl}
          alt={t("slider.slideImageAlt")}
          className=" object-contain transition-transform duration-500 group-hover:scale-[1.02]"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/default.png";
          }}
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 group-hover:ring-black/10 transition-all duration-300" />
      </div>
    </a>
  );
}

function SkeletonCard({ wide }: { wide?: boolean }) {
  return (
    <div
      className={`rounded-2xl animate-pulse ${wide ? "col-span-2" : ""}`}
      style={{
        backgroundColor: "var(--color-bg-subtle)",
        aspectRatio: wide ? "16/5" : "16/5",
      }}
    />
  );
}

export function BannersModal({ onClose }: BannersModalProps) {
  const t = useTranslations("home");

  const group1 = useBanners(1);
  const group2 = useBanners(2);
  const group3 = useBanners(3);

  const isLoading = group1.isLoading || group2.isLoading || group3.isLoading;

  // Flatten all banners from all groups into one list
  const allBanners: Banner[] = [
    ...group1.banners,
    ...group2.banners,
    ...group3.banners,
  ];

  // Split into pairs for 2-per-row layout
  const rows: Banner[][] = [];
  for (let i = 0; i < allBanners.length; i += 2) {
    rows.push(allBanners.slice(i, i + 2));
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[101] rounded-t-3xl animate-fade-in
                   sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
                   sm:rounded-3xl sm:w-full sm:max-w-3xl lg:max-w-4xl"
        style={{
          backgroundColor: "var(--color-bg)",
          maxHeight: "88dvh",
          display: "flex",
          flexDirection: "column",
        }}
        role="dialog"
        aria-label={t("slider.modalAriaLabel")}
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: "var(--color-border)" }}
          />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div>
            <h3
              className="text-lg font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text)",
              }}
            >
              {t("slider.allBannersTitle")}
            </h3>
            {!isLoading && allBanners.length > 0 && (
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
              >
                {allBanners.length} {t("slider.bannersCount")}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{
              backgroundColor: "var(--color-bg-muted)",
              color: "var(--color-text-muted)",
            }}
            aria-label={t("slider.closeAriaLabel")}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto custom-scrollbar p-5 flex flex-col gap-3">
          {/* Skeleton */}
          {isLoading && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <SkeletonCard />
                <SkeletonCard />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <SkeletonCard />
                <SkeletonCard />
              </div>
              <SkeletonCard wide />
            </>
          )}

          {/* 2-per-row grid */}
          {!isLoading &&
            rows.map((row, rowIdx) =>
              row.length === 2 ? (
                // Full row — 2 images side by side
                <div key={rowIdx} className="grid grid-cols-2 gap-3">
                  {row.map((banner, idx) => (
                    <ModalBannerImage key={idx} banner={banner} t={t} />
                  ))}
                </div>
              ) : (
                // Lone image — full width
                <div key={rowIdx} className="w-full">
                  <ModalBannerImage banner={row[0]} t={t} />
                </div>
              )
            )}

          {/* Empty state */}
          {!isLoading && allBanners.length === 0 && (
            <p
              className="text-sm text-center py-12"
              style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
            >
              {t("slider.noBanners")}
            </p>
          )}
        </div>
      </div>
    </>
  );
}