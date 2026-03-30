import OwnerSection from "@/components/OwnerSection";
import HeroSection from "@/components/HeroSection";
import LogoSection from "@/components/LogoSection";
import ProductSection from "@/components/Product/ProductSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductSection />
      <LogoSection />
      <OwnerSection />
    </>
  );
}
