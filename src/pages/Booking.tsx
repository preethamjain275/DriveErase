import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, differenceInDays, differenceInHours } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Users, Fuel, Settings2, ArrowRight, Check, Download, FileText, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

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

const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Jaipur", "Kolkata"];

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [step, setStep] = useState(1);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");

  // Form states
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [pickupDate, setPickupDate] = useState<Date | undefined>(new Date());
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  );

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (!authLoading && !user && step > 1) {
      toast.error("Please login to continue booking");
      navigate("/auth");
    }
  }, [user, authLoading, step, navigate]);

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("available", true);
    
    if (error) {
      toast.error("Failed to load vehicles");
    } else {
      setVehicles(data || []);
    }
  };

  const calculateTotal = () => {
    if (!selectedVehicle || !pickupDate || !returnDate) return 0;
    const days = differenceInDays(returnDate, pickupDate);
    const hours = differenceInHours(returnDate, pickupDate) % 24;
    let total = days * selectedVehicle.price_per_day;
    if (hours > 0 && selectedVehicle.price_per_hour) {
      total += hours * selectedVehicle.price_per_hour;
    }
    return total;
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book");
      navigate("/auth");
      return;
    }

    if (!selectedVehicle || !pickupDate || !returnDate || !location) {
      toast.error("Please fill all booking details");
      return;
    }

    setLoading(true);
    const invoiceNum = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      vehicle_id: selectedVehicle.id,
      pickup_location: location,
      pickup_date: pickupDate.toISOString(),
      return_date: returnDate.toISOString(),
      total_amount: calculateTotal(),
      status: "confirmed",
      payment_status: "paid",
      invoice_number: invoiceNum,
    });

    if (error) {
      toast.error("Booking failed. Please try again.");
    } else {
      setInvoiceNumber(invoiceNum);
      setBookingComplete(true);
      setStep(4);
      toast.success("Booking confirmed successfully!");
    }
    setLoading(false);
  };

  const downloadInvoice = () => {
    if (!selectedVehicle || !pickupDate || !returnDate) return;
    
    const invoiceContent = `
DRIVEEASE - INVOICE
==========================================
Invoice Number: ${invoiceNumber}
Date: ${format(new Date(), "PPP")}

CUSTOMER DETAILS
-----------------------------------------
Email: ${user?.email}

BOOKING DETAILS
-----------------------------------------
Vehicle: ${selectedVehicle.brand} ${selectedVehicle.model}
Type: ${selectedVehicle.type}
Pickup Location: ${location}
Pickup Date: ${format(pickupDate, "PPP")}
Return Date: ${format(returnDate, "PPP")}
Duration: ${differenceInDays(returnDate, pickupDate)} days

PAYMENT DETAILS
-----------------------------------------
Rate per Day: ₹${selectedVehicle.price_per_day}
Total Amount: ₹${calculateTotal()}
Payment Status: PAID

==========================================
Thank you for choosing DriveEase!
Contact: +91 98765 43210
Email: pritamjain@gmail.com
==========================================
    `;

    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DriveEase_Invoice_${invoiceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Invoice downloaded!");
  };

  return (
    <>
      <Helmet>
        <title>Book Your Car - DriveEase</title>
        <meta name="description" content="Book your self-drive car with DriveEase. Easy booking, multiple payment options, instant confirmation." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-12">
              {[
                { num: 1, label: "Select Car" },
                { num: 2, label: "Choose Dates" },
                { num: 3, label: "Payment" },
                { num: 4, label: "Confirmation" },
              ].map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-smooth",
                    step >= s.num 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                  </div>
                  <span className={cn(
                    "ml-2 text-sm font-medium hidden sm:inline",
                    step >= s.num ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {s.label}
                  </span>
                  {i < 3 && (
                    <div className={cn(
                      "w-8 sm:w-16 h-0.5 mx-2 sm:mx-4",
                      step > s.num ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Select Vehicle */}
            {step === 1 && (
              <div className="animate-fade-up">
                <h2 className="text-2xl font-display font-bold text-foreground mb-6">Choose Your Vehicle</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle)}
                      className={cn(
                        "bg-card rounded-2xl overflow-hidden shadow-card cursor-pointer transition-smooth",
                        selectedVehicle?.id === vehicle.id 
                          ? "ring-2 ring-primary shadow-card-hover" 
                          : "hover:shadow-card-hover"
                      )}
                    >
                      <div className="h-40 bg-gradient-card p-4 flex items-center justify-center">
                        <div className="w-full h-full bg-muted/20 rounded-xl flex items-center justify-center text-4xl">
                          🚗
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-xs text-muted-foreground">{vehicle.brand}</p>
                            <h3 className="text-lg font-display font-bold">{vehicle.model}</h3>
                          </div>
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {vehicle.type}
                          </span>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" /> {vehicle.seats}
                          </span>
                          <span className="flex items-center gap-1">
                            <Fuel className="w-4 h-4" /> {vehicle.fuel_type.split("/")[0]}
                          </span>
                          <span className="flex items-center gap-1">
                            <Settings2 className="w-4 h-4" /> {vehicle.transmission.split("/")[0]}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-border">
                          <p className="text-lg font-bold">₹{vehicle.price_per_day}<span className="text-sm font-normal text-muted-foreground">/day</span></p>
                          {selectedVehicle?.id === vehicle.id && (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <Button 
                    onClick={() => selectedVehicle && setStep(2)} 
                    disabled={!selectedVehicle}
                    className="px-8"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Choose Dates */}
            {step === 2 && (
              <div className="max-w-2xl mx-auto animate-fade-up">
                <h2 className="text-2xl font-display font-bold text-foreground mb-6">Select Dates & Location</h2>
                <div className="bg-card rounded-2xl p-6 shadow-card space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      Pickup Location
                    </label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-accent" />
                        Pickup Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            {pickupDate ? format(pickupDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={pickupDate}
                            onSelect={setPickupDate}
                            disabled={(date) => date < new Date()}
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-accent" />
                        Return Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            {returnDate ? format(returnDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={returnDate}
                            onSelect={setReturnDate}
                            disabled={(date) => date < (pickupDate || new Date())}
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {selectedVehicle && pickupDate && returnDate && (
                    <div className="bg-secondary/50 rounded-xl p-4">
                      <h4 className="font-semibold mb-2">Booking Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vehicle</span>
                          <span>{selectedVehicle.brand} {selectedVehicle.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration</span>
                          <span>{differenceInDays(returnDate, pickupDate)} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rate</span>
                          <span>₹{selectedVehicle.price_per_day}/day</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                          <span>Total</span>
                          <span className="text-primary">₹{calculateTotal()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => {
                      if (!user) {
                        toast.error("Please login to continue");
                        navigate("/auth");
                        return;
                      }
                      if (!location) {
                        toast.error("Please select a pickup location");
                        return;
                      }
                      setStep(3);
                    }} 
                    disabled={!location || !pickupDate || !returnDate}
                    className="px-8"
                  >
                    Continue to Payment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="max-w-2xl mx-auto animate-fade-up">
                <h2 className="text-2xl font-display font-bold text-foreground mb-6">Payment</h2>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold mb-4">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vehicle</span>
                        <span>{selectedVehicle?.brand} {selectedVehicle?.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span>{location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pickup</span>
                        <span>{pickupDate && format(pickupDate, "PPP")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Return</span>
                        <span>{returnDate && format(returnDate, "PPP")}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                        <span>Total Amount</span>
                        <span className="text-primary">₹{calculateTotal()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-accent" />
                      Payment Method
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {["UPI", "Credit Card", "Debit Card", "Net Banking"].map((method) => (
                        <button
                          key={method}
                          className="p-4 border border-border rounded-xl text-center hover:border-primary hover:bg-primary/5 transition-smooth"
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      This is a demo. Click "Pay Now" to simulate payment.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button onClick={handleBooking} disabled={loading} className="px-8">
                    {loading ? "Processing..." : `Pay ₹${calculateTotal()}`}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && bookingComplete && (
              <div className="max-w-2xl mx-auto text-center animate-fade-up">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-display font-bold text-foreground mb-4">Booking Confirmed!</h2>
                <p className="text-muted-foreground mb-8">
                  Your booking has been confirmed. We've sent the details to your email.
                </p>

                <div className="bg-card rounded-2xl p-6 shadow-card text-left mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-accent" />
                    <h4 className="font-semibold">Booking Details</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Invoice Number</span>
                      <span className="font-mono">{invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vehicle</span>
                      <span>{selectedVehicle?.brand} {selectedVehicle?.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span>{location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pickup Date</span>
                      <span>{pickupDate && format(pickupDate, "PPP")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Return Date</span>
                      <span>{returnDate && format(returnDate, "PPP")}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t border-border">
                      <span>Total Paid</span>
                      <span className="text-primary">₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={downloadInvoice} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </Button>
                  <Button onClick={() => navigate("/")} className="gap-2">
                    Back to Home
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BookingPage;
