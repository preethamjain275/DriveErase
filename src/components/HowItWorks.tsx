import { MapPin, Car, UserCheck, CreditCard, ArrowRight } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: MapPin,
    title: "Select City & Travel Dates",
    description: "Choose your pickup location and schedule your travel dates",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    id: 2,
    icon: Car,
    title: "Choose Car & Delivery Mode",
    description: "Browse our fleet and select how you want your car delivered",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: 3,
    icon: UserCheck,
    title: "Verify Yourself",
    description: "Quick verification with your driving license and ID",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    id: 4,
    icon: CreditCard,
    title: "Make Payment",
    description: "Secure payment with multiple options available",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
            How To Book a Self-Drive Car Online
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Book a car online in just 4 simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative group">
              <div className="bg-card rounded-2xl p-6 h-full shadow-card hover:shadow-card-hover transition-smooth animate-fade-up" style={{ animationDelay: `${index * 0.15}s` }}>
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg">
                  {step.id.toString().padStart(2, "0")}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 ${step.bgColor} rounded-xl flex items-center justify-center mb-5`}>
                  <step.icon className={`w-7 h-7 ${step.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-display font-bold text-foreground mb-2 group-hover:text-primary transition-fast">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Arrow (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
