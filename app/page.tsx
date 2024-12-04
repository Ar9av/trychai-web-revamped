import { HeroSection } from "@/components/landing/hero-section";
// import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorks } from "@/components/landing/how-it-works";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />
      {/* <FeaturesSection /> */}
      <HowItWorks />
    </div>
  );
}