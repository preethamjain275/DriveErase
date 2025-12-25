import { Car, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const quickLinks = [
    { name: "About Us", href: "#about" },
    { name: "Our Fleet", href: "#fleets" },
    { name: "Locations", href: "#" },
    { name: "Deals & Offers", href: "#deals" },
    { name: "FAQs", href: "#faq" },
  ];

  const services = [
    { name: "Daily Rentals", href: "#" },
    { name: "Monthly Subscription", href: "#" },
    { name: "Airport Pickup", href: "#" },
    { name: "Corporate Rentals", href: "#" },
    { name: "Chauffeur Service", href: "#" },
  ];

  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia"];

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Youtube, href: "#" },
  ];

  return (
    <footer className="bg-foreground text-background pt-16 pb-8" id="contact">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Newsletter */}
        <div className="bg-primary/20 rounded-2xl p-8 mb-12 -mt-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-display font-bold text-background mb-2">
                Subscribe to our newsletter
              </h3>
              <p className="text-background/70">
                Get the latest deals and offers straight to your inbox
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-background/10 backdrop-blur-sm text-background placeholder:text-background/50 border border-background/20 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button className="px-6 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-accent-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-display font-bold text-background">DriveEase</span>
                <span className="text-[10px] text-background/60 -mt-1 tracking-wider">SELF DRIVE CARS</span>
              </div>
            </a>
            <p className="text-background/70 mb-6 max-w-sm">
              Experience the freedom of self-drive car rentals. Premium vehicles, flexible options, and 24/7 support for your journey.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-accent transition-smooth"
                >
                  <social.icon className="w-5 h-5 text-background" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-background mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-background/70 hover:text-accent transition-fast">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-background mb-4">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <a href={service.href} className="text-background/70 hover:text-accent transition-fast">
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-background mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="text-background/70">1800-123-456</p>
                  <p className="text-xs text-background/50">Toll Free, 24/7</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent mt-0.5" />
                <p className="text-background/70">support@driveease.com</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <p className="text-background/70">Available in {cities.length}+ cities</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Cities */}
        <div className="py-6 border-t border-background/10">
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm text-background/50">
            {cities.map((city) => (
              <a key={city} href="#" className="hover:text-accent transition-fast">
                Self Drive Cars in {city}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">
            © 2025 DriveEase. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-background/50">
            <a href="#" className="hover:text-accent transition-fast">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-fast">Terms of Service</a>
            <a href="#" className="hover:text-accent transition-fast">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
