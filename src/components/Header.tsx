import { useState } from "react";
import { Menu, X, Phone, User, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Deals", href: "#deals" },
    { name: "Fleets", href: "#fleets" },
    { name: "About Us", href: "#about" },
    { name: "Contact Us", href: "#contact" },
  ];

  const handleLogin = () => {
    toast.info("Login feature coming soon!", {
      description: "We're working on user authentication. Stay tuned!"
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center transition-smooth group-hover:scale-105">
              <Car className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-display font-bold text-primary">DriveEase</span>
              <span className="text-[10px] text-muted-foreground -mt-1 tracking-wider">SELF DRIVE CARS</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-fast relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:+919876543210" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-fast">
              <Phone className="w-4 h-4" />
              <span>+91 98765 43210</span>
            </a>
            <div className="w-px h-6 bg-border" />
            <a href="#faq" className="text-sm font-medium text-foreground/80 hover:text-primary transition-fast">
              FAQ's
            </a>
            <Button variant="default" className="rounded-full px-6" onClick={handleLogin}>
              <User className="w-4 h-4 mr-2" />
              Login or Signup
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-fast"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="py-3 px-4 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted rounded-lg transition-fast"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 mt-2 border-t border-border">
                <Button variant="default" className="w-full rounded-full" onClick={handleLogin}>
                  <User className="w-4 h-4 mr-2" />
                  Login or Signup
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
