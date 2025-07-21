import HeroSection from "@/components/home/Hero";
import AboutSection from "@/components/home/About";
import ProductSection from "@/components/home/ProductSection";
import "core-js/stable";
import "regenerator-runtime/runtime";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProductSection />
    </>
  );
}
