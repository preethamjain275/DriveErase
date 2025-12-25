import { Smartphone, Apple, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const AppDownload = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary rounded-3xl p-8 lg:p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
                Refer your friends and be a partner of DriveEase
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg">
                Download the app for exclusive deals and ease of booking. Get rewards for every referral!
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="default"
                  className="h-14 px-6 rounded-xl gap-3"
                >
                  <div className="w-8 h-8 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] opacity-80 block leading-none">GET IT ON</span>
                    <span className="text-sm font-semibold leading-none">Google Play</span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-14 px-6 rounded-xl gap-3 bg-card"
                >
                  <div className="w-8 h-8 bg-foreground/5 rounded-lg flex items-center justify-center">
                    <Apple className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] opacity-60 block leading-none">Download on the</span>
                    <span className="text-sm font-semibold leading-none">App Store</span>
                  </div>
                </Button>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative">
                {/* Phone Mockup */}
                <div className="w-64 h-[500px] bg-card rounded-[40px] shadow-card-hover border-8 border-foreground/10 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground/10 rounded-b-2xl" />
                  <div className="h-full bg-gradient-to-b from-accent/10 to-primary/10 p-4 pt-10">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 bg-primary rounded-xl mx-auto mb-2 flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <p className="text-sm font-bold text-foreground">DriveEase</p>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card/80 rounded-xl p-3">
                          <div className="w-full h-3 bg-muted rounded-full mb-2" />
                          <div className="w-3/4 h-2 bg-muted/60 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Floating Badge */}
                <div className="absolute -right-6 top-1/4 bg-card rounded-xl p-3 shadow-card animate-float">
                  <span className="text-2xl">🎁</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
