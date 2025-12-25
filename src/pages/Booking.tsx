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
import { getVehicleImage } from "@/lib/vehicleImages";
import { toast } from "sonner";
import { format, differenceInDays, addDays } from "date-fns";
import jsPDF from "jspdf";
import { 
  Calendar as CalendarIcon, MapPin, Users, Fuel, Settings2, 
  ArrowRight, Check, Download, FileText, QrCode, Clock
} from "lucide-react";
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
  const [paymentScanned, setPaymentScanned] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Form states
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [pickupDate, setPickupDate] = useState<Date | undefined>(new Date());
  const [rentalDays, setRentalDays] = useState("3");
  const [returnDate, setReturnDate] = useState<Date | undefined>(addDays(new Date(), 3));

  useEffect(() => {
    fetchVehicles();
    const vehicleId = searchParams.get("vehicle");
    if (vehicleId) {
      fetchSelectedVehicle(vehicleId);
    }
  }, []);

  useEffect(() => {
    if (pickupDate && rentalDays) {
      setReturnDate(addDays(pickupDate, parseInt(rentalDays)));
    }
  }, [pickupDate, rentalDays]);

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

  const fetchSelectedVehicle = async (vehicleId: string) => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", vehicleId)
      .single();
    
    if (!error && data) {
      setSelectedVehicle(data);
    }
  };

  const calculateTotal = () => {
    if (!selectedVehicle || !pickupDate || !returnDate) return 0;
    const days = differenceInDays(returnDate, pickupDate);
    return days * selectedVehicle.price_per_day;
  };

  const handleScanPayment = () => {
    setProcessingPayment(true);
    setTimeout(() => {
      setPaymentScanned(true);
      setProcessingPayment(false);
      toast.success("Payment scanned successfully!");
    }, 2000);
  };

  const handleSubmitPayment = async () => {
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
      toast.success("Payment successful! Booking confirmed!");
    }
    setLoading(false);
  };

  const downloadInvoice = () => {
    if (!selectedVehicle || !pickupDate || !returnDate) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("DRIVEEASE", 20, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Self Drive Car Rental", 20, 32);
    
    // Invoice Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("TAX INVOICE", pageWidth - 20, 55, { align: "right" });
    
    // Invoice Details
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: ${invoiceNumber}`, pageWidth - 20, 65, { align: "right" });
    doc.text(`Date: ${format(new Date(), "dd MMM yyyy")}`, pageWidth - 20, 72, { align: "right" });
    
    // Customer Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 20, 65);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(user?.email || "Customer", 20, 72);
    
    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 85, pageWidth - 20, 85);
    
    // Booking Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Booking Details", 20, 95);
    
    const details = [
      ["Vehicle", `${selectedVehicle.brand} ${selectedVehicle.model}`],
      ["Type", selectedVehicle.type],
      ["Pickup Location", location],
      ["Pickup Date", format(pickupDate, "dd MMM yyyy, hh:mm a")],
      ["Return Date", format(returnDate, "dd MMM yyyy, hh:mm a")],
      ["Duration", `${differenceInDays(returnDate, pickupDate)} days`],
    ];
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    let y = 105;
    details.forEach(([label, value]) => {
      doc.text(label, 20, y);
      doc.text(value, 100, y);
      y += 8;
    });
    
    // Divider
    doc.line(20, y + 5, pageWidth - 20, y + 5);
    
    // Payment Details
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Payment Details", 20, y);
    
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const baseAmount = calculateTotal();
    doc.text("Rental Charges", 20, y);
    doc.text(`₹${baseAmount}`, pageWidth - 20, y, { align: "right" });
    
    y += 8;
    const gst = Math.round(baseAmount * 0.18);
    doc.text("GST (18%)", 20, y);
    doc.text(`₹${gst}`, pageWidth - 20, y, { align: "right" });
    
    // Total
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, pageWidth - 20, y);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Total Amount", 20, y);
    doc.text(`₹${baseAmount + gst}`, pageWidth - 20, y, { align: "right" });
    
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(34, 197, 94);
    doc.text("PAID", pageWidth - 20, y, { align: "right" });
    
    // Footer
    doc.setTextColor(128, 128, 128);
    doc.setFontSize(8);
    doc.text("Thank you for choosing DriveEase!", pageWidth / 2, 270, { align: "center" });
    doc.text("Contact: +91 98765 43210 | Email: support@driveease.in", pageWidth / 2, 277, { align: "center" });
    
    doc.save(`DriveEase_Invoice_${invoiceNumber}.pdf`);
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
                { num: 2, label: "Choose Duration" },
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
                        <img 
                          src={getVehicleImage(vehicle.image_url)}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="max-h-full max-w-full object-contain"
                        />
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

            {/* Step 2: Choose Duration */}
            {step === 2 && (
              <div className="max-w-2xl mx-auto animate-fade-up">
                <h2 className="text-2xl font-display font-bold text-foreground mb-6">Select Duration & Location</h2>
                <div className="bg-card rounded-2xl p-6 shadow-card space-y-6">
                  {/* Selected Vehicle Preview */}
                  {selectedVehicle && (
                    <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                      <img 
                        src={getVehicleImage(selectedVehicle.image_url)}
                        alt={`${selectedVehicle.brand} ${selectedVehicle.model}`}
                        className="w-20 h-16 object-contain"
                      />
                      <div>
                        <p className="font-bold">{selectedVehicle.brand} {selectedVehicle.model}</p>
                        <p className="text-sm text-muted-foreground">₹{selectedVehicle.price_per_day}/day</p>
                      </div>
                    </div>
                  )}

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

                  {/* Duration Selector */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      How many days do you need the car?
                    </label>
                    <Select value={rentalDays} onValueChange={setRentalDays}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 30].map((days) => (
                          <SelectItem key={days} value={String(days)}>
                            {days} {days === 1 ? "day" : "days"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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

                  {selectedVehicle && pickupDate && returnDate && (
                    <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Booking Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vehicle</span>
                          <span>{selectedVehicle.brand} {selectedVehicle.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pickup Date</span>
                          <span>{format(pickupDate, "dd MMM yyyy")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Return Date</span>
                          <span>{format(returnDate, "dd MMM yyyy")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration</span>
                          <span>{rentalDays} {parseInt(rentalDays) === 1 ? "day" : "days"}</span>
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

            {/* Step 3: Payment with QR */}
            {step === 3 && (
              <div className="max-w-2xl mx-auto animate-fade-up">
                <h2 className="text-2xl font-display font-bold text-foreground mb-6">Complete Payment</h2>
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  {/* Order Summary */}
                  <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold mb-4">Order Summary</h4>
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={getVehicleImage(selectedVehicle?.image_url || null)}
                        alt={`${selectedVehicle?.brand} ${selectedVehicle?.model}`}
                        className="w-16 h-12 object-contain"
                      />
                      <div>
                        <p className="font-medium">{selectedVehicle?.brand} {selectedVehicle?.model}</p>
                        <p className="text-sm text-muted-foreground">{location}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pickup</span>
                        <span>{pickupDate && format(pickupDate, "dd MMM yyyy")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Return</span>
                        <span>{returnDate && format(returnDate, "dd MMM yyyy")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span>{rentalDays} days</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                        <span>Total Amount</span>
                        <span className="text-primary">₹{calculateTotal()}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Payment */}
                  <div className="text-center space-y-4">
                    <h4 className="font-semibold flex items-center justify-center gap-2">
                      <QrCode className="w-5 h-5 text-accent" />
                      Scan to Pay
                    </h4>
                    
                    <div className="bg-white p-6 rounded-xl inline-block mx-auto">
                      {/* Fake QR Code SVG */}
                      <svg width="200" height="200" viewBox="0 0 200 200">
                        <rect width="200" height="200" fill="white"/>
                        <g fill="black">
                          {/* QR Corner Squares */}
                          <rect x="10" y="10" width="50" height="50"/>
                          <rect x="17" y="17" width="36" height="36" fill="white"/>
                          <rect x="24" y="24" width="22" height="22"/>
                          
                          <rect x="140" y="10" width="50" height="50"/>
                          <rect x="147" y="17" width="36" height="36" fill="white"/>
                          <rect x="154" y="24" width="22" height="22"/>
                          
                          <rect x="10" y="140" width="50" height="50"/>
                          <rect x="17" y="147" width="36" height="36" fill="white"/>
                          <rect x="24" y="154" width="22" height="22"/>
                          
                          {/* Random QR Pattern */}
                          <rect x="70" y="10" width="8" height="8"/>
                          <rect x="86" y="10" width="8" height="8"/>
                          <rect x="102" y="10" width="8" height="8"/>
                          <rect x="118" y="10" width="8" height="8"/>
                          
                          <rect x="70" y="26" width="8" height="8"/>
                          <rect x="86" y="26" width="8" height="8"/>
                          <rect x="118" y="26" width="8" height="8"/>
                          
                          <rect x="70" y="42" width="8" height="8"/>
                          <rect x="102" y="42" width="8" height="8"/>
                          <rect x="118" y="42" width="8" height="8"/>
                          
                          <rect x="10" y="70" width="8" height="8"/>
                          <rect x="26" y="70" width="8" height="8"/>
                          <rect x="42" y="70" width="8" height="8"/>
                          <rect x="70" y="70" width="8" height="8"/>
                          <rect x="86" y="70" width="8" height="8"/>
                          <rect x="102" y="70" width="8" height="8"/>
                          <rect x="118" y="70" width="8" height="8"/>
                          <rect x="150" y="70" width="8" height="8"/>
                          <rect x="166" y="70" width="8" height="8"/>
                          <rect x="182" y="70" width="8" height="8"/>
                          
                          <rect x="10" y="86" width="8" height="8"/>
                          <rect x="42" y="86" width="8" height="8"/>
                          <rect x="70" y="86" width="8" height="8"/>
                          <rect x="86" y="86" width="8" height="8"/>
                          <rect x="118" y="86" width="8" height="8"/>
                          <rect x="166" y="86" width="8" height="8"/>
                          
                          <rect x="10" y="102" width="8" height="8"/>
                          <rect x="26" y="102" width="8" height="8"/>
                          <rect x="42" y="102" width="8" height="8"/>
                          <rect x="70" y="102" width="8" height="8"/>
                          <rect x="102" y="102" width="8" height="8"/>
                          <rect x="118" y="102" width="8" height="8"/>
                          <rect x="150" y="102" width="8" height="8"/>
                          <rect x="166" y="102" width="8" height="8"/>
                          <rect x="182" y="102" width="8" height="8"/>
                          
                          <rect x="10" y="118" width="8" height="8"/>
                          <rect x="42" y="118" width="8" height="8"/>
                          <rect x="86" y="118" width="8" height="8"/>
                          <rect x="102" y="118" width="8" height="8"/>
                          <rect x="118" y="118" width="8" height="8"/>
                          <rect x="150" y="118" width="8" height="8"/>
                          <rect x="182" y="118" width="8" height="8"/>
                          
                          <rect x="70" y="140" width="8" height="8"/>
                          <rect x="86" y="140" width="8" height="8"/>
                          <rect x="102" y="140" width="8" height="8"/>
                          <rect x="150" y="140" width="8" height="8"/>
                          <rect x="166" y="140" width="8" height="8"/>
                          
                          <rect x="70" y="156" width="8" height="8"/>
                          <rect x="102" y="156" width="8" height="8"/>
                          <rect x="118" y="156" width="8" height="8"/>
                          <rect x="150" y="156" width="8" height="8"/>
                          <rect x="182" y="156" width="8" height="8"/>
                          
                          <rect x="70" y="172" width="8" height="8"/>
                          <rect x="86" y="172" width="8" height="8"/>
                          <rect x="102" y="172" width="8" height="8"/>
                          <rect x="118" y="172" width="8" height="8"/>
                          <rect x="150" y="172" width="8" height="8"/>
                          <rect x="166" y="172" width="8" height="8"/>
                          <rect x="182" y="172" width="8" height="8"/>
                        </g>
                      </svg>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Scan this QR code using any UPI app to pay ₹{calculateTotal()}
                    </p>
                    
                    <p className="text-xs text-muted-foreground">
                      UPI ID: driveease@upi
                    </p>

                    {!paymentScanned ? (
                      <Button 
                        onClick={handleScanPayment} 
                        disabled={processingPayment}
                        variant="outline"
                        className="w-full"
                      >
                        {processingPayment ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                            Processing...
                          </>
                        ) : (
                          "I have scanned and paid"
                        )}
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                        <Check className="w-5 h-5" />
                        Payment Received!
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmitPayment} 
                    disabled={!paymentScanned || loading} 
                    className="px-8"
                  >
                    {loading ? "Processing..." : "Submit & Confirm Booking"}
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
                <h2 className="text-3xl font-display font-bold text-foreground mb-4">Payment Successful!</h2>
                <p className="text-muted-foreground mb-2">
                  Your booking has been confirmed. We've sent the details to your email.
                </p>
                <p className="text-sm text-primary font-medium mb-8">
                  You can track your rental in "My Bookings"
                </p>

                <div className="bg-card rounded-2xl p-6 shadow-card text-left mb-8">
                  <div className="flex items-center gap-4 mb-4 p-4 bg-secondary/50 rounded-xl">
                    <img 
                      src={getVehicleImage(selectedVehicle?.image_url || null)}
                      alt={`${selectedVehicle?.brand} ${selectedVehicle?.model}`}
                      className="w-20 h-16 object-contain"
                    />
                    <div>
                      <p className="font-bold">{selectedVehicle?.brand} {selectedVehicle?.model}</p>
                      <p className="text-sm text-muted-foreground">{selectedVehicle?.type}</p>
                    </div>
                  </div>
                  
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
                      <span className="text-muted-foreground">Location</span>
                      <span>{location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pickup Date</span>
                      <span>{pickupDate && format(pickupDate, "dd MMM yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Return Date</span>
                      <span>{returnDate && format(returnDate, "dd MMM yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span>{rentalDays} days</span>
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
                    Download Invoice (PDF)
                  </Button>
                  <Button onClick={() => navigate("/my-bookings")} className="gap-2">
                    View My Bookings
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
