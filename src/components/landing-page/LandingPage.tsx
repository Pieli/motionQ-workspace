import React from "react";

import Navigation from "@/components/landing-page/Navigation";
import HeroSection from "@/components/landing-page/HeroSection";
import ProcessSection from "@/components/landing-page/ProcessSection";
import WaitlistSection from "@/components/landing-page/WaitlistSection";
import Footer from "@/components/landing-page/Footer";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ProcessSection />
      <WaitlistSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
