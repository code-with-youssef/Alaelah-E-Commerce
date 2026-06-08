"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useSearchSuggestions } from "@/src/hooks/home/useSearchSuggestions";
import {
  loadRecentSearches,
  removeRecentSearch,
  saveRecentSearch,
} from "@/src/lib/products/recentSearches";
import { SuggestionItem } from "./SuggestionItem";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const t = useTranslations("home");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const { suggestions, isLoading: suggestionsLoading } = useSearchSuggestions(query, 3);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setRecentSearches(loadRecentSearches());
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const submitSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    saveRecentSearch(trimmed);
    onClose();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submitSearch(query);
  };

  const handleRemoveRecent = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecentSearch(term);
    setRecentSearches(loadRecentSearches());
  };

  if (!isOpen) return null;

  const showSuggestions = query.trim().length > 0;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="fixed z-[101] bg-white shadow-2xl"
        style={{ backgroundColor: "var(--color-bg)", top: 0, left: 0, right: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label={t("search.ariaLabel")}
      >
        <div className="max-w-2xl mx-auto w-full px-4 pt-4 pb-6">

          {/* Search input row */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-3 flex-1 rounded-2xl px-4 py-3 border transition-shadow"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-primary)",
                boxShadow: "var(--shadow-input)",
              }}
            >
              <MagnifyingGlassIcon
                className="w-5 h-5 shrink-0"
                style={{ color: "var(--color-primary)" }}
              />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("search.placeholder")}
                className="flex-1 bg-transparent outline-none text-[0.9375rem]"
                style={{ fontFamily: "var(--font-sans)", color: "var(--color-text)" }}
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label={t("search.clearAriaLabel")}>
                  <XMarkIcon className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-sm font-semibold shrink-0 transition-colors"
              style={{ fontFamily: "var(--font-sans)", color: "var(--color-primary)" }}
            >
              {t("search.cancel")}
            </button>
          </div>

          {/* Live Suggestions */}
          {showSuggestions && (
            <div className="mt-4 space-y-1">
              {suggestionsLoading && (
                <div className="py-3 text-center">
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
                  >
                    {t("search.searching")}
                  </span>
                </div>
              )}

              {!suggestionsLoading && suggestions.length > 0 && (
                <>
                  {suggestions.map((product) => (
                    <SuggestionItem
                      key={product.id}
                      product={product}
                      onSelect={() => submitSearch(query)} // ← always use the typed query
                    />
                  ))}

                  <button
                    onClick={() => submitSearch(query)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
                    style={{
                      backgroundColor: "var(--color-bg)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <MagnifyingGlassIcon
                      className="w-5 h-5 shrink-0"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-primary)", fontFamily: "var(--font-sans)" }}
                    >
                      {t("search.seeAllResults", { query })}
                    </span>
                  </button>
                </>
              )}

              {!suggestionsLoading && suggestions.length === 0 && (
                <button
                  onClick={() => submitSearch(query)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
                  style={{
                    backgroundColor: "var(--color-bg-subtle)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <MagnifyingGlassIcon
                    className="w-5 h-5 shrink-0"
                    style={{ color: "var(--color-primary)" }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text)", fontFamily: "var(--font-sans)" }}
                  >
                    {t("search.searchFor", { query })}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Default state: recent searches */}
          {!showSuggestions && (
            <div className="mt-6 space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ClockIcon className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                    <span
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
                    >
                      {t("search.recent")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <div key={term} className="flex items-center">
                        <button
                          onClick={() => submitSearch(term)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                          style={{
                            backgroundColor: "var(--color-bg-subtle)",
                            color: "var(--color-text)",
                            fontFamily: "var(--font-sans)",
                            border: "1px solid var(--color-border)",
                            borderRight: "none",
                            borderRadius: "9999px 0 0 9999px",
                          }}
                        >
                          {term}
                        </button>
                        <button
                          onClick={(e) => handleRemoveRecent(term, e)}
                          aria-label={t("search.removeRecentAriaLabel", { term })}
                          className="flex items-center justify-center px-2 py-2 text-sm transition-colors"
                          style={{
                            backgroundColor: "var(--color-bg-subtle)",
                            color: "var(--color-text-muted)",
                            border: "1px solid var(--color-border)",
                            borderLeft: "none",
                            borderRadius: "0 9999px 9999px 0",
                            height: "100%",
                          }}
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}