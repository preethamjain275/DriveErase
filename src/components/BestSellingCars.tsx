import { ChevronLeft, ChevronRight, Users, Fuel, Settings2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import carCreta from "@/assets/car-creta.png";
import carInnova from "@/assets/car-innova.png";
import carCiaz from "@/assets/car-ciaz.png";
import carScorpio from "@/assets/car-scorpio.png";
import carSwift from "@/assets/car-swift.png";

const cars = [
  {
    id: 1,
    brand: "Hyundai",
    model: "Creta",
    type: "SUV",
    seats: 5,
    fuel: "Petrol/Diesel",
    transmission: "Manual/Auto",
    price: 2500,
    image: carCreta,
  },
  {
    id: 2,
    brand: "Toyota",
    model: "Innova Crysta",
    type: "MPV",
    seats: 7,
    fuel: "Diesel",
    transmission: "Manual/Auto",
    price: 3500,
    image: carInnova,
  },
  {
    id: 3,
    brand: "Maruti",
    model: "Ciaz",
    type: "Sedan",
    seats: 5,
    fuel: "Petrol",
    transmission: "Manual/Auto",
    price: 1800,
    image: carCiaz,
  },
  {
    id: 4,
    brand: "Mahindra",
    model: "Scorpio",
    type: "SUV",
    seats: 7,
    fuel: "Diesel",
    transmission: "Manual",
    price: 2800,
    image: carScorpio,
  },
  {
    id: 5,
    brand: "Maruti",
    model: "Swift",
    type: "Hatchback",
    seats: 5,
    fuel: "Petrol",
    transmission: "Manual/Auto",
    price: 1200,
    image: carSwift,
  },
];

const BestSellingCars = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (cars.length - itemsPerPage + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (cars.length - itemsPerPage + 1)) % (cars.length - itemsPerPage + 1));
  };

  const handleViewDetails = (car: typeof cars[0]) => {
    toast.info(`${car.brand} ${car.model}`, {
      description: `Starting from ₹${car.price}/day. Book now for your next trip!`
    });
  };

  return (
    <section className="py-16 bg-secondary/30" id="fleets">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-2">
              Best Selling Models
            </h2>
            <p className="text-muted-foreground">
              Choose from our wide range of premium vehicles
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-border bg-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-smooth"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-border bg-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-smooth"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.slice(currentIndex, currentIndex + itemsPerPage).map((car, index) => (
            <div
              key={car.id}
              className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-smooth group animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Car Image */}
              <div className="relative h-48 bg-gradient-card p-4 overflow-hidden">
                <span className="absolute top-4 left-4 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  {car.type}
                </span>
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-contain group-hover:scale-105 transition-smooth"
                />
              </div>

              {/* Car Info */}
              <div className="p-5">
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{car.brand}</p>
                  <h3 className="text-xl font-display font-bold text-foreground">{car.model}</h3>
                </div>

                {/* Specs */}
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{car.seats}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="w-4 h-4" />
                    <span>{car.fuel.split("/")[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Settings2 className="w-4 h-4" />
                    <span>{car.transmission.split("/")[0]}</span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <span className="text-xs text-muted-foreground">Starting from</span>
                    <p className="text-lg font-bold text-foreground">₹{car.price}<span className="text-sm font-normal text-muted-foreground">/day</span></p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full group/btn"
                    onClick={() => handleViewDetails(car)}
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="flex justify-center gap-2 mt-8 md:hidden">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestSellingCars;
