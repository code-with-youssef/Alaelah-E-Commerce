"use client";
import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { PromoSlider } from "../slider/PromoSlider";
import { AllCategorySections } from "../categories/AllCategorySections";
import { LocationHeader } from "../location/LocationHeader";
import { HomeProductSection } from "../homeProducts/HomeProductSection";
import { HomeCategorySection } from "../categories/HomeCategorySection";
import { SearchBar } from "../../common/SearchBar";

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionCard({ children, bgDiff = true }: { children: React.ReactNode; bgDiff?: boolean }) {
  return (
    <div
      className="mx-3 px-3 rounded-2xl"
      style={{
        backgroundColor: bgDiff ? "var(--color-bg-subtle)" : "var(--color-bg)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
      }}
    >
      {children}
    </div>
  );
}

/** Returns true when user is scrolling UP (or is near top) */
function useScrolledUp(threshold = 10) {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < threshold) {
        setVisible(true);           // always show at top
      } else if (y < lastY.current) {
        setVisible(true);           // scrolling up → show
      } else if (y > lastY.current + 4) {
        setVisible(false);          // scrolling down → hide (4px deadzone)
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return visible;
}

export function HomeClient() {
  const barVisible = useScrolledUp();

  return (
    <main
      className="min-h-dvh md:pb-8 flex flex-col gap-3 py-3"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Mobile: location scrolls with page, no smart hide needed */}
      <div className="md:hidden px-4">
        <LocationHeader deliveryMin={35} deliveryMax={45} />
      </div>

      {/* Desktop: smart-hide bar — slides up into navbar on scroll down, back on scroll up */}
      <div
        className="hidden md:flex fixed left-0 right-0 z-30 items-center gap-4 px-6 py-2 mx-6"
        style={{
          top: "60px",
          backgroundColor: "var(--color-bg)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          transform: barVisible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.28s ease",
        }}
      >
        <div className="shrink-0">
          <LocationHeader deliveryMin={35} deliveryMax={45} />
        </div>
        <div className="flex-1">
          <SearchBar />
        </div>
      </div>
      {/* Spacer so content doesn't sit under the fixed bar */}
      <div className="hidden md:block h-[68px]" />

      <AnimatedSection>
        <div style={{ backgroundColor: "var(--color-bg)" }}>
          <PromoSlider />
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <SectionCard>
          <HomeProductSection type="featured" />
        </SectionCard>
      </AnimatedSection>

      <AnimatedSection>
        <SectionCard>
          <HomeCategorySection />
        </SectionCard>
      </AnimatedSection>

      <AnimatedSection>
        <SectionCard>
          <HomeProductSection type="best-seller" />
        </SectionCard>
      </AnimatedSection>

      <AnimatedSection>
        <SectionCard>
          <HomeProductSection type="todays-deal" />
        </SectionCard>
      </AnimatedSection>

      <AnimatedSection>
        <SectionCard bgDiff={false}>
          <AllCategorySections />
        </SectionCard>
      </AnimatedSection>

      <div className="h-3" />
    </main>
  );
}