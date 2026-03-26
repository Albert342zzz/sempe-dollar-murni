import OwnerSection from "@/components/OwnerSection";
import Slider from "@/components/Slider";
import LogoSection from "@/components/LogoSection";
import ProductSection from "@/components/ProductSection";

export default function HomePage() {
  return (
    <>
      <Slider />
      <LogoSection />
      <OwnerSection />
      <ProductSection />
    </>
  );
}
