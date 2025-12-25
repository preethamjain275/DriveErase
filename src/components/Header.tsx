import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Phone, User, Car, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Deals", href: "/#deals" },
    { name: "Fleets", href: "/#fleets" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/#contact" },
  ];

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center transition-smooth group-hover:scale-105">
              <Car className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-display font-bold text-primary">DriveEase</span>
              <span className="text-[10px] text-muted-foreground -mt-1 tracking-wider">SELF DRIVE CARS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-fast relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:+919876543210" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-fast">
              <Phone className="w-4 h-4" />
              <span>+91 98765 43210</span>
            </a>
            <div className="w-px h-6 bg-border" />
            
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/booking">
                  <Button variant="outline" className="rounded-full px-4">
                    Book Now
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="default" className="rounded-full px-6">
                  <User className="w-4 h-4 mr-2" />
                  Login or Signup
                </Button>
              </Link>
            )}
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
                <Link
                  key={link.name}
                  to={link.href}
                  className="py-3 px-4 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted rounded-lg transition-fast"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-border space-y-2">
                {user ? (
                  <>
                    <Link to="/booking" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full rounded-full">
                        Book Now
                      </Button>
                    </Link>
                    <Button variant="default" className="w-full rounded-full" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="default" className="w-full rounded-full">
                      <User className="w-4 h-4 mr-2" />
                      Login or Signup
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
