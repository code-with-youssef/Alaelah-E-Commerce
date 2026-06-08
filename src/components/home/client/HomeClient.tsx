"use client";
import { motion, type Variants } from "framer-motion";
import { PromoSlider } from "../slider/PromoSlider";
import { AllCategorySections } from "../categories/AllCategorySections";
import { BannerCarousel } from "../banner/BannerCarousel";
import { BrandsSection } from "../brands/BrandsSection";
import { LocationHeader } from "../location/LocationHeader";
import { HomeProductSection } from "../homeProducts/HomeProductSection";
import { HomeCategorySection } from "../categories/HomeCategorySection";
import { SearchBar } from "../../common/SearchBar";

// Reusable animation variant
const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

function AnimatedSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
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

function SectionCard({
  children,
  bgDiff = true,
}: {
  children: React.ReactNode;
  bgDiff?: boolean;
}) {
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

export function HomeClient() {
  return (
    <main
      className="min-h-dvh md:pb-8 flex flex-col gap-3 py-3"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="hidden md:flex px-3 flex-row items-center gap-2">
        <LocationHeader deliveryMin={35} deliveryMax={45} />
        <div className="flex-1">
          <SearchBar />
        </div>
      </div>
      {/* Promo slider — subtle fade in */}
      <AnimatedSection>
        <div style={{ backgroundColor: "var(--color-bg)" }}>
          <PromoSlider />
        </div>
      </AnimatedSection>

      {/* Banner carousel */}
     {/*  <AnimatedSection>
        <BannerCarousel />
      </AnimatedSection> */}

      {/* Featured */}
      <AnimatedSection>
        <SectionCard>
          <HomeProductSection type="featured" />
        </SectionCard>
      </AnimatedSection>

      {/* Deals Category */}
      <AnimatedSection>
        <SectionCard>
          <HomeCategorySection />
        </SectionCard>
      </AnimatedSection>

      {/* Best sellers */}
      <AnimatedSection>
        <SectionCard>
          <HomeProductSection type="best-seller" />
        </SectionCard>
      </AnimatedSection>

      {/* Today's deals */}
      <AnimatedSection>
        <SectionCard>
          <HomeProductSection type="todays-deal" />
        </SectionCard>
      </AnimatedSection>

      {/* All categories */}
      <AnimatedSection>
        <SectionCard bgDiff={false}>
          <AllCategorySections />
        </SectionCard>
      </AnimatedSection>

      {/* Brands */}
      {/* <AnimatedSection>
        <SectionCard>
          <BrandsSection />
        </SectionCard>
      </AnimatedSection> */}

      <div className="h-3" />
    </main>
  );
}
