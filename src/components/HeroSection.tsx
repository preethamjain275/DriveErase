import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, ChevronDown, Search, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import heroImage from "@/assets/hero-illustration.png";

const HeroSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"daily" | "monthly">("daily");
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("26-Dec-2025");
  const [pickupTime, setPickupTime] = useState("09:30 AM");
  const [returnDate, setReturnDate] = useState("29-Dec-2025");
  const [returnTime, setReturnTime] = useState("06:30 PM");

  const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Jaipur", "Kolkata", "Ahmedabad", "Lucknow"];

  const handleSearch = () => {
    if (!location) {
      toast.error("Please select a city to continue");
      return;
    }
    navigate(`/booking?location=${encodeURIComponent(location)}`);
  };

  return (
    <section className="relative min-h-[90vh] bg-hero pt-20 lg:pt-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(90vh-6rem)]">
          {/* Left Content - Booking Form */}
          <div className="order-2 lg:order-1 pb-8 lg:pb-0">
            {/* Tabs */}
            <div className="inline-flex bg-card rounded-xl p-1 shadow-card mb-6 animate-fade-up">
              <button
                onClick={() => setActiveTab("daily")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-smooth ${
                  activeTab === "daily"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Daily Rentals
              </button>
              <button
                onClick={() => setActiveTab("monthly")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-smooth ${
                  activeTab === "monthly"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly Subscription
              </button>
            </div>

            {/* Search Form */}
            <div className="bg-card rounded-2xl shadow-card p-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Location */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Location
                  </label>
                  <div className="relative">
                    <select 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full py-2.5 px-3 bg-secondary rounded-lg text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-accent focus:outline-none transition-fast"
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Pick-up Date */}
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Pick-Up Date
                  </label>
                  <input
                    type="text"
                    value={`${pickupDate} ${pickupTime}`}
                    readOnly
                    className="w-full py-2.5 px-3 bg-secondary rounded-lg text-sm font-medium cursor-pointer focus:ring-2 focus:ring-accent focus:outline-none transition-fast"
                  />
                </div>

                {/* Return Date */}
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Return Date
                  </label>
                  <input
                    type="text"
                    value={`${returnDate} ${returnTime}`}
                    readOnly
                    className="w-full py-2.5 px-3 bg-secondary rounded-lg text-sm font-medium cursor-pointer focus:ring-2 focus:ring-accent focus:outline-none transition-fast"
                  />
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <Button onClick={handleSearch} className="w-full rounded-xl h-11" variant="default">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Duration Display */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold text-foreground">3 Days and 9 hours</span>
                </div>
              </div>
            </div>

            {/* Hero Text */}
            <div className="mt-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-display font-bold text-foreground leading-tight">
                Multiple Delivery Options on{" "}
                <span className="text-primary">Self Drive Car Rental</span>
              </h1>
              <p className="mt-4 text-muted-foreground text-lg max-w-lg">
                Get your car delivered at Doorstep, Airport, Hub or nearest location as per your convenience.
              </p>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="order-1 lg:order-2 flex items-center justify-center animate-fade-in">
            <div className="relative">
              <img
                src={heroImage}
                alt="Self Drive Car Rental"
                className="w-full max-w-xl lg:max-w-2xl animate-float"
              />
              {/* Floating badges */}
              <div className="absolute -left-4 top-1/3 bg-card rounded-xl p-3 shadow-card animate-fade-up hidden md:block" style={{ animationDelay: "0.4s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🚗</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Starting from</p>
                    <p className="text-sm font-bold text-foreground">₹60/hr</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 bottom-1/4 bg-card rounded-xl p-3 shadow-card animate-fade-up hidden md:block" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg">⭐</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rated</p>
                    <p className="text-sm font-bold text-foreground">4.8/5 Stars</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel dots indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-smooth ${
              i === 0 ? "w-6 bg-primary" : "bg-border hover:bg-muted-foreground"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
