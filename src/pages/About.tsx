import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Target, Heart, Award, Lightbulb, Shield } from "lucide-react";

const teamMembers = [
  {
    name: "Pritam Jain",
    role: "Founder & CEO",
    bio: "Visionary leader with 10+ years in the automobile industry. Founded DriveEase to revolutionize car rentals in India.",
    avatar: "PJ",
  },
  {
    name: "Praanjal Sharma",
    role: "Co-Founder & COO",
    bio: "Operations expert ensuring seamless vehicle delivery and customer satisfaction across all locations.",
    avatar: "PS",
  },
  {
    name: "Prajwal Kumar",
    role: "Technical Lead",
    bio: "Tech enthusiast building the digital backbone of DriveEase with cutting-edge solutions.",
    avatar: "PK",
  },
  {
    name: "Pram Singh",
    role: "Operations Head",
    bio: "Fleet management specialist maintaining our vehicles to the highest standards of quality and safety.",
    avatar: "PS",
  },
];

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description: "Every decision we make starts with our customers' needs and experiences.",
  },
  {
    icon: Shield,
    title: "Safety & Trust",
    description: "We ensure every vehicle meets strict safety standards and maintain complete transparency.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Continuously improving our services with technology and creative solutions.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Striving for excellence in every aspect of our car rental services.",
  },
];

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us - DriveEase | Our Story, Mission & Team</title>
        <meta
          name="description"
          content="Learn about DriveEase, India's premier self-drive car rental service. Meet our team led by Pritam Jain and discover our mission to revolutionize car rentals."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-hero">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-6 animate-fade-up">
                  About <span className="text-primary">DriveEase</span>
                </h1>
                <p className="text-lg text-muted-foreground animate-fade-up" style={{ animationDelay: "0.1s" }}>
                  Transforming the way India travels, one self-drive journey at a time.
                </p>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="animate-fade-up">
                  <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                    Our Story
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      DriveEase was born from a simple idea: make car rentals accessible, affordable, and hassle-free for every Indian traveler. Founded in 2023 by Pritam Jain, our journey began in Mumbai with just 5 cars.
                    </p>
                    <p>
                      Today, we operate in 8+ major cities across India, with a fleet of over 500+ well-maintained vehicles. Our commitment to quality service and customer satisfaction has made us one of the fastest-growing self-drive car rental companies in the country.
                    </p>
                    <p>
                      We believe in the freedom of the open road – the joy of driving through scenic routes, the convenience of having your own vehicle, and the privacy that comes with self-drive rentals.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                  <div className="bg-card rounded-2xl p-6 text-center shadow-card">
                    <p className="text-4xl font-display font-bold text-primary mb-2">500+</p>
                    <p className="text-muted-foreground">Vehicles</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 text-center shadow-card">
                    <p className="text-4xl font-display font-bold text-primary mb-2">8+</p>
                    <p className="text-muted-foreground">Cities</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 text-center shadow-card">
                    <p className="text-4xl font-display font-bold text-primary mb-2">50K+</p>
                    <p className="text-muted-foreground">Happy Customers</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 text-center shadow-card">
                    <p className="text-4xl font-display font-bold text-primary mb-2">4.8</p>
                    <p className="text-muted-foreground">Star Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card rounded-2xl p-8 shadow-card animate-fade-up">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground mb-4">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To provide every Indian traveler with access to safe, reliable, and affordable self-drive car rentals, enabling them to explore the country with complete freedom and convenience.
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-8 shadow-card animate-fade-up" style={{ animationDelay: "0.1s" }}>
                  <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                    <Lightbulb className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground mb-4">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To become India's most trusted and preferred self-drive car rental platform, setting new standards in customer experience, vehicle quality, and technological innovation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-display font-bold text-foreground mb-4">Our Core Values</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  The principles that guide everything we do at DriveEase
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <div 
                    key={value.title}
                    className="bg-card rounded-2xl p-6 text-center shadow-card hover:shadow-card-hover transition-smooth animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="font-display font-bold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Users className="w-4 h-4" />
                  Meet Our Team
                </div>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                  The People Behind DriveEase
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  A passionate team dedicated to making your travel experiences memorable
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member, index) => (
                  <div 
                    key={member.name}
                    className="bg-card rounded-2xl p-6 text-center shadow-card hover:shadow-card-hover transition-smooth group animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground group-hover:scale-110 transition-smooth">
                      {member.avatar}
                    </div>
                    <h3 className="text-lg font-display font-bold text-foreground mb-1">{member.name}</h3>
                    <p className="text-sm text-accent font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
