import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getVehicleImage } from "@/lib/vehicleImages";
import { toast } from "sonner";
import { format, differenceInDays, isPast, isFuture, isToday, addDays } from "date-fns";
import { 
  Calendar, MapPin, Clock, AlertCircle, CheckCircle2, 
  Car, Download, Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";

interface Booking {
  id: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  total_amount: number;
  status: string;
  payment_status: string;
  invoice_number: string | null;
  created_at: string;
  vehicle: {
    id: string;
    brand: string;
    model: string;
    type: string;
    image_url: string | null;
    price_per_day: number;
  };
}

const MyBookings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (user) {
      fetchBookings();
    }
  }, [user, authLoading, navigate]);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        vehicle:vehicles(id, brand, model, type, image_url, price_per_day)
      `)
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Failed to load bookings");
    } else {
      setBookings(data as Booking[] || []);
    }
    setLoading(false);
  };

  const getBookingStatus = (booking: Booking) => {
    const returnDate = new Date(booking.return_date);
    const pickupDate = new Date(booking.pickup_date);
    const today = new Date();

    if (isPast(returnDate)) {
      return { status: "completed", label: "Completed", color: "bg-green-500" };
    } else if (isPast(pickupDate) && isFuture(returnDate)) {
      return { status: "active", label: "Active", color: "bg-primary" };
    } else if (isToday(pickupDate)) {
      return { status: "pickup-today", label: "Pickup Today", color: "bg-yellow-500" };
    } else {
      return { status: "upcoming", label: "Upcoming", color: "bg-blue-500" };
    }
  };

  const getRemainingDays = (returnDate: string) => {
    const days = differenceInDays(new Date(returnDate), new Date());
    return days;
  };

  const getProgressPercentage = (pickupDate: string, returnDate: string) => {
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const today = new Date();
    
    const totalDays = differenceInDays(returnD, pickup);
    const elapsedDays = differenceInDays(today, pickup);
    
    if (elapsedDays < 0) return 0;
    if (elapsedDays >= totalDays) return 100;
    
    return Math.round((elapsedDays / totalDays) * 100);
  };

  const downloadInvoice = (booking: Booking) => {
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
    doc.text(`Invoice No: ${booking.invoice_number}`, pageWidth - 20, 65, { align: "right" });
    doc.text(`Date: ${format(new Date(booking.created_at), "dd MMM yyyy")}`, pageWidth - 20, 72, { align: "right" });
    
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
      ["Vehicle", `${booking.vehicle.brand} ${booking.vehicle.model}`],
      ["Type", booking.vehicle.type],
      ["Pickup Location", booking.pickup_location],
      ["Pickup Date", format(new Date(booking.pickup_date), "dd MMM yyyy, hh:mm a")],
      ["Return Date", format(new Date(booking.return_date), "dd MMM yyyy, hh:mm a")],
      ["Duration", `${differenceInDays(new Date(booking.return_date), new Date(booking.pickup_date))} days`],
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
    doc.text("Rental Charges", 20, y);
    doc.text(`₹${booking.total_amount}`, pageWidth - 20, y, { align: "right" });
    
    y += 8;
    doc.text("GST (18%)", 20, y);
    doc.text(`₹${Math.round(booking.total_amount * 0.18)}`, pageWidth - 20, y, { align: "right" });
    
    // Total
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, pageWidth - 20, y);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Total Amount", 20, y);
    doc.text(`₹${Math.round(booking.total_amount * 1.18)}`, pageWidth - 20, y, { align: "right" });
    
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
    
    doc.save(`DriveEase_Invoice_${booking.invoice_number}.pdf`);
    toast.success("Invoice downloaded!");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Bookings - DriveEase</title>
        <meta name="description" content="View and manage your car rental bookings with DriveEase." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="text-3xl font-display font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground mb-8">Track and manage your rental history</p>

            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl shadow-card">
                <Car className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-6">Start your journey by booking a car</p>
                <Button onClick={() => navigate("/booking")}>Book Now</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => {
                  const statusInfo = getBookingStatus(booking);
                  const remainingDays = getRemainingDays(booking.return_date);
                  const progress = getProgressPercentage(booking.pickup_date, booking.return_date);
                  const isActive = statusInfo.status === "active";
                  const showNotification = remainingDays <= 1 && remainingDays >= 0 && isActive;

                  return (
                    <div 
                      key={booking.id}
                      className="bg-card rounded-2xl shadow-card overflow-hidden"
                    >
                      <div className="flex flex-col lg:flex-row">
                        {/* Vehicle Image */}
                        <div className="lg:w-64 h-48 lg:h-auto bg-gradient-card p-4 flex items-center justify-center">
                          <img 
                            src={getVehicleImage(booking.vehicle.image_url)}
                            alt={`${booking.vehicle.brand} ${booking.vehicle.model}`}
                            className="max-h-32 object-contain"
                          />
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={cn(
                                  "px-2 py-0.5 text-xs font-medium text-white rounded-full",
                                  statusInfo.color
                                )}>
                                  {statusInfo.label}
                                </span>
                                {showNotification && (
                                  <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full flex items-center gap-1 animate-pulse">
                                    <Bell className="w-3 h-3" />
                                    Return Soon!
                                  </span>
                                )}
                              </div>
                              <h3 className="text-xl font-bold">
                                {booking.vehicle.brand} {booking.vehicle.model}
                              </h3>
                              <p className="text-sm text-muted-foreground">{booking.vehicle.type}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Total Amount</p>
                              <p className="text-xl font-bold text-primary">₹{booking.total_amount}</p>
                            </div>
                          </div>

                          {/* Dates & Location */}
                          <div className="grid sm:grid-cols-3 gap-4 mb-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-accent" />
                              <div>
                                <p className="text-muted-foreground">Pickup</p>
                                <p className="font-medium">{format(new Date(booking.pickup_date), "dd MMM yyyy")}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-accent" />
                              <div>
                                <p className="text-muted-foreground">Return</p>
                                <p className="font-medium">{format(new Date(booking.return_date), "dd MMM yyyy")}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-accent" />
                              <div>
                                <p className="text-muted-foreground">Location</p>
                                <p className="font-medium">{booking.pickup_location}</p>
                              </div>
                            </div>
                          </div>

                          {/* Progress Tracker for Active Bookings */}
                          {isActive && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-muted-foreground">Rental Progress</span>
                                <span className="font-medium">
                                  {remainingDays === 0 ? "Return today!" : `${remainingDays} day${remainingDays > 1 ? "s" : ""} remaining`}
                                </span>
                              </div>
                              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary transition-all duration-500"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => downloadInvoice(booking)}
                              className="gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download Invoice
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/vehicle/${booking.vehicle.id}`)}
                              className="gap-2"
                            >
                              <Car className="w-4 h-4" />
                              View Vehicle
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MyBookings;
