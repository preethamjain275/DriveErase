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
        <title>DriveEase - Self Drive Car Rental India | Book Cars Online from ₹60/hr</title>
        <meta
          name="description"
          content="Book self-drive cars online in India starting from ₹60/hr. Wide range of SUVs, Sedans & Hatchbacks with doorstep delivery, unlimited kilometers, and 24/7 support. Created by Pritam Jain."
        />
        <meta name="keywords" content="car rental India, self drive cars, rent a car Mumbai, car hire Delhi, vehicle rental Bangalore, SUV rental India" />
        <meta name="author" content="Pritam Jain" />
        <link rel="canonical" href="https://driveease.in" />
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
