"use client";

import { useTranslations } from "next-intl";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSlider } from "@/src/hooks/home/useSliders";
import { useResolvedUrl } from "@/src/hooks/shared/useResolvedUrl";
import { Slider } from "@/src/types/home/slider";

interface SlidersModalProps {
  onClose: () => void;
}

function ModalSlideImage({ slide, t }: { slide: Slider; t: any }) {
  const imageUrl = useResolvedUrl(slide.photo);
  const linkUrl = useResolvedUrl(slide.url);

  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      aria-label={t("slider.slideLinkAlt")}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="relative w-full overflow-hidden rounded-2xl">
        {/* Blurred background */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage: `url(${imageUrl})`,
              filter: "blur(20px) brightness(0.7)",
              transform: "scale(1.2)",
            }}
          />
        </div>

        {/* Main image */}
        <div
          className="relative flex items-center justify-center p-3"
          style={{ aspectRatio: "16/7" }}
        >
          <img
            src={imageUrl}
            alt={t("slider.slideImageAlt")}
            className="w-full h-full object-contain max-h-full max-w-full transition-transform duration-500 group-hover:scale-[1.02]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/default.png";
            }}
          />
        </div>

        {/* Subtle ring */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10 group-hover:ring-black/20 transition-all duration-300" />
      </div>
    </a>
  );
}

export function SlidersModal({ onClose }: SlidersModalProps) {
  const t = useTranslations("home");
  const { banners: slides, isLoading } = useSlider();

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
              {t("slider.allSlidesTitle")}
            </h3>
            {!isLoading && slides.length > 0 && (
              <p
                className="text-xs mt-0.5"
                style={{
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {slides.length} {t("slider.slidesCount")}
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
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-full rounded-2xl animate-pulse"
                style={{
                  aspectRatio: "16/7",
                  backgroundColor: "var(--color-bg-subtle)",
                }}
              />
            ))}

          {/* Slides — one per row, full width */}
          {!isLoading &&
            slides.map((slide) => (
              <ModalSlideImage key={slide.photo} slide={slide} t={t} />
            ))}

          {/* Empty state */}
          {!isLoading && slides.length === 0 && (
            <p
              className="text-sm text-center py-12"
              style={{
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {t("slider.noSlides")}
            </p>
          )}
        </div>
      </div>
    </>
  );
}