import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { useState } from "react";

const offers = [
  {
    id: 1,
    title: "Flat 10% off",
    code: "HOLIDAY10",
    description: "Flat 10% off on all bookings",
    gradient: "from-accent/20 to-primary/10",
  },
  {
    id: 2,
    title: "Flat 15% off",
    code: "WINTER15",
    description: "Flat 15% off on weekly rentals",
    gradient: "from-primary/20 to-accent/10",
  },
  {
    id: 3,
    title: "Flat 20% off",
    code: "NEWYEAR20",
    description: "Flat 20% off on monthly subscriptions",
    gradient: "from-accent/20 to-secondary/40",
  },
  {
    id: 4,
    title: "Free Delivery",
    code: "FREEDROP",
    description: "Free doorstep delivery on first booking",
    gradient: "from-secondary to-accent/10",
  },
];

const TrendingOffers = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(offers.length / 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(offers.length / 2)) % Math.ceil(offers.length / 2));
  };

  return (
    <section className="py-12 bg-background" id="deals">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
            Trending Offers
          </h2>
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:bg-secondary transition-smooth"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:bg-secondary transition-smooth"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {offers.map((offer, index) => (
            <div
              key={offer.id}
              className={`bg-gradient-to-br ${offer.gradient} rounded-2xl p-6 border border-border hover:shadow-card transition-smooth cursor-pointer group animate-fade-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center shadow-sm">
                  <Tag className="w-6 h-6 text-accent" />
                </div>
                <span className="px-3 py-1 bg-card/80 rounded-full text-xs font-semibold text-primary">
                  {offer.code}
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-2 group-hover:text-primary transition-fast">
                {offer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{offer.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingOffers;
