import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/Product/ProductSection";
import OwnerSection from "@/components/OwnerSection";
import WhyUsSection from "@/components/WhyUsSection";
import HighlightsSection from "@/components/HighlightsSection";
import TestimonialSection from "@/components/TestimonialSection";
import CtaSection from "@/components/CtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductSection />
      <OwnerSection />
      <WhyUsSection />
      <HighlightsSection className="bg-cream-soft" />
      <TestimonialSection />
      <CtaSection />
    </>
  );
}
