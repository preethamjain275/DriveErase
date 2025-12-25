import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrendingOffers from "@/components/TrendingOffers";
import AppDownload from "@/components/AppDownload";
import BestSellingCars from "@/components/BestSellingCars";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>DriveEase - Self Drive Car Rental | Book Cars Online from $60/hr</title>
        <meta
          name="description"
          content="Book self-drive cars online starting from $60/hr. Wide range of SUVs, Sedans & Hatchbacks with doorstep delivery, unlimited kilometers, and 24/7 support."
        />
        <meta name="keywords" content="car rental, self drive cars, rent a car, car hire, vehicle rental, SUV rental" />
        <link rel="canonical" href="https://driveease.com" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <TrendingOffers />
          <AppDownload />
          <BestSellingCars />
          <HowItWorks />
          <FeaturesSection />
          <Testimonials />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
