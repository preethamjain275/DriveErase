import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getVehicleImage } from "@/lib/vehicleImages";
import { toast } from "sonner";
import { 
  Users, Fuel, Settings2, ArrowLeft, ArrowRight, Star, 
  Shield, Gauge, Car, Calendar, MapPin, Check
} from "lucide-react";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  type: string;
  seats: number;
  fuel_type: string;
  transmission: string;
  price_per_day: number;
  price_per_hour: number | null;
  image_url: string | null;
  description: string | null;
  features: string[] | null;
}

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    rating: 5,
    date: "2 weeks ago",
    comment: "Amazing car! Very well maintained and fuel efficient. The booking process was smooth.",
    avatar: "RS"
  },
  {
    id: 2,
    name: "Priya Patel",
    rating: 4,
    date: "1 month ago",
    comment: "Good experience overall. Car was clean and comfortable for our family trip.",
    avatar: "PP"
  },
  {
    id: 3,
    name: "Amit Kumar",
    rating: 5,
    date: "1 month ago",
    comment: "Perfect for city driving. Great mileage and easy to handle in traffic.",
    avatar: "AK"
  },
  {
    id: 4,
    name: "Sneha Gupta",
    rating: 4,
    date: "2 months ago",
    comment: "Loved the car! Would definitely rent again for my next trip.",
    avatar: "SG"
  }
];

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    if (!id) return;
    
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      toast.error("Vehicle not found");
      navigate("/");
    } else {
      setVehicle(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!vehicle) return null;

  const mainImage = getVehicleImage(vehicle.image_url);
  const galleryImages = [mainImage, mainImage, mainImage, mainImage];
  const specifications = [
    { icon: Users, label: "Seating Capacity", value: `${vehicle.seats} Persons` },
    { icon: Fuel, label: "Fuel Type", value: vehicle.fuel_type },
    { icon: Settings2, label: "Transmission", value: vehicle.transmission },
    { icon: Car, label: "Vehicle Type", value: vehicle.type },
    { icon: Gauge, label: "Mileage", value: "15-18 km/l" },
    { icon: Shield, label: "Insurance", value: "Fully Covered" },
  ];

  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <>
      <Helmet>
        <title>{vehicle.brand} {vehicle.model} - DriveEase Car Rental</title>
        <meta name="description" content={`Rent ${vehicle.brand} ${vehicle.model} starting from ₹${vehicle.price_per_day}/day. ${vehicle.description}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mb-6 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="bg-gradient-card rounded-2xl p-8 h-80 flex items-center justify-center">
                  <img 
                    src={galleryImages[selectedImageIndex]} 
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {galleryImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`bg-gradient-card rounded-xl p-3 h-20 flex items-center justify-center transition-smooth ${
                        selectedImageIndex === index ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-border"
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`View ${index + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="space-y-6">
                <div>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                    {vehicle.type}
                  </span>
                  <h1 className="text-3xl lg:text-4xl font-display font-bold mt-3">
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.round(Number(averageRating)) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {averageRating} ({reviews.length} reviews)
                    </span>
                  </div>
                </div>

                <p className="text-muted-foreground">
                  {vehicle.description || "Experience the perfect blend of comfort and performance with this premium vehicle. Ideal for both city drives and highway adventures."}
                </p>

                {/* Pricing */}
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-3xl font-bold">₹{vehicle.price_per_day}</span>
                    <span className="text-muted-foreground pb-1">/day</span>
                  </div>
                  {vehicle.price_per_hour && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Hourly rate: ₹{vehicle.price_per_hour}/hr
                    </p>
                  )}
                  <Button 
                    onClick={() => navigate(`/booking?vehicle=${vehicle.id}`)} 
                    className="w-full gap-2"
                    size="lg"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Features */}
                {vehicle.features && vehicle.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1.5 bg-secondary rounded-full text-sm flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-primary" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            <section className="mt-12">
              <h2 className="text-2xl font-display font-bold mb-6">Full Specifications</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {specifications.map((spec, index) => (
                  <div 
                    key={index}
                    className="bg-card rounded-xl p-4 flex items-center gap-4 shadow-card"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <spec.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{spec.label}</p>
                      <p className="font-semibold">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold">Customer Reviews</h2>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{averageRating}</span>
                  <span className="text-muted-foreground">({reviews.length} reviews)</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {reviews.map((review) => (
                  <div 
                    key={review.id}
                    className="bg-card rounded-xl p-5 shadow-card"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {review.avatar}
                        </div>
                        <div>
                          <p className="font-semibold">{review.name}</p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default VehicleDetails;
