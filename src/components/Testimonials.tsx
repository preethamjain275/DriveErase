import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Prajwal Joshi",
    location: "Sunkadakatte, Bengaluru, India",
    rating: 5,
    text: "Your services are highly professional right from booking the car, to the prompt delivery at the designated pickup. The car was clean and the team was very welcoming. Highly recommend!",
    avatar: "PS",
  },
  {
    id: 2,
    name: "Pramit Jain",
    location: "Bangalore, India",
    rating: 5,
    text: "Thank you very much for your quality service. The doorstep delivery made everything so convenient. Really appreciate this gesture!",
    avatar: "PK",
  },
  {
    id: 3,
    name: "Preetham Jain M",
    location: "Bengaluru, India",
    rating: 5,
    text: "Thank you for providing unlimited kilometers. Our road trip with friends was stress-free and fun because we knew there were no hidden charges!",
    avatar: "PV",
  },
  {
    id: 4,
    name: "Pranjal Ranjan",
    location: "Bihar, India",
    rating: 5,
    text: "I loved the service. The cars were clean and the delivery guy was polite. Thank you for the surprise gift in your car. Will definitely book again!",
    avatar: "PS",
  },
  {
    id: 5,
    name: "Rohit Agarwal",
    location: "Pune, India",
    rating: 5,
    text: "Best car rental service in India! Great quality at amazing prices. Fun experience and well-maintained vehicles. Thanks DriveEase!",
    avatar: "RA",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-3">
              What people say
              <br />
              about us
            </h2>
            <p className="text-muted-foreground">Our clients send us smilies with our services and we love them.</p>
          </div>
          <div className="flex gap-2 mt-6 lg:mt-0">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getVisibleTestimonials().map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-smooth animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Quote className="w-5 h-5 text-accent" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/90 leading-relaxed mb-6">"{testimonial.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-smooth ${
                index === currentIndex ? "w-6 bg-primary" : "bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
