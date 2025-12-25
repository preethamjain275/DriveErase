import { Gauge, MapPinned, Truck, Shield, Wallet, RotateCcw, BadgeCheck, Headphones } from "lucide-react";

const features = [
  {
    icon: Gauge,
    title: "Unlimited km to drive",
    description: "No restrictions on your journey",
  },
  {
    icon: MapPinned,
    title: "100+ Locations",
    description: "Available in multiple cities",
  },
  {
    icon: Truck,
    title: "Anywhere delivery",
    description: "Get your car delivered at doorstep",
  },
  {
    icon: Shield,
    title: "Privacy & freedom",
    description: "Your personal space, your rules",
  },
];

const benefits = [
  {
    icon: Wallet,
    title: "Multiple Payment Options",
    description: "Choose from credit card, debit card, net banking, or UPI. Pay conveniently!",
    gradient: "from-accent/10 to-primary/5",
  },
  {
    icon: RotateCcw,
    title: "Easy Cancellation",
    description: "Change of plans? Cancel your rental reservation with just a few clicks.",
    gradient: "from-primary/10 to-accent/5",
  },
  {
    icon: BadgeCheck,
    title: "Best Price Guarantee",
    description: "We guarantee the lowest prices on self-drive car rentals!",
    gradient: "from-secondary to-accent/10",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Quick Features */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-card rounded-2xl p-6 text-center shadow-card hover:shadow-card-hover transition-smooth group animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-smooth">
                <feature.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
            Why ride with DriveEase?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the best in self-drive car rentals with our premium services
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={`bg-gradient-to-br ${benefit.gradient} rounded-2xl p-8 border border-border hover:shadow-card transition-smooth animate-fade-up`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <benefit.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* 24/7 Support Banner */}
        <div className="mt-16 bg-gradient-primary rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='1' fill='white' fill-opacity='0.1'/%3E%3C/svg%3E\")" }} />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Headphones className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl lg:text-3xl font-display font-bold text-primary-foreground mb-3">
              24/7 Call Center Assistance
            </h3>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-6">
              Dedicated round-the-clock support for all your trip assistance needs
            </p>
            <div className="inline-flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="text-primary-foreground font-semibold text-lg">1800-123-456</span>
              <span className="text-primary-foreground/60">|</span>
              <span className="text-primary-foreground/80 text-sm">Toll Free</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
