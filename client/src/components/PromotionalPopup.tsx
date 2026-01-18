import { useState, useEffect } from "react";
import { X, Sparkles, Gift, Timer, Leaf, Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PromotionalPopup() {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 45 });

  useEffect(() => {
    // Show popup after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Countdown timer
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleShopNow = () => {
    setIsVisible(false);
    // Add your shop now logic here
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full relative overflow-hidden border-2 border-green-200 shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 opacity-80" />
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-100 rounded-full opacity-60" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-100 rounded-full opacity-60" />

        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardContent className="p-6 relative">
          {/* Header with Icons */}
          <div className="text-center mb-4">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              <Gift className="h-8 w-8 text-green-600" />
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              🌱 Welcome to Okkyno!
            </h2>
            <p className="text-gray-600 text-sm">Your Gardening Journey Starts Here</p>
          </div>

          {/* Special Offer Badge */}
          <div className="flex justify-center mb-4">
            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 text-lg font-bold shadow-lg">
              🎉 Special Launch Offer!
            </Badge>
          </div>

          {/* Main Offer */}
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-green-600 mb-2">
              25% OFF
            </div>
            <p className="text-gray-700 font-medium mb-2">
              On Your First Order + Free Shipping
            </p>
            <p className="text-sm text-gray-600">
              Premium plants, expert guides, and everything you need for a thriving garden
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-white/70 rounded-lg p-3 mb-4 border border-green-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700">Limited Time Offer</span>
            </div>
            <div className="flex justify-center gap-2">
              <div className="text-center">
                <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold min-w-[40px]">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-600 mt-1">Hours</div>
              </div>
              <div className="text-center">
                <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold min-w-[40px]">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-600 mt-1">Minutes</div>
              </div>
              <div className="text-center">
                <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold min-w-[40px]">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-gray-600 mt-1">Seconds</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-500" />
              <span className="text-gray-700">Premium Plants</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-green-500" />
              <span className="text-gray-700">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-green-500" />
              <span className="text-gray-700">Expert Guides</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-green-500" />
              <span className="text-gray-700">Fast Delivery</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2">
            <Button 
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 text-base shadow-lg transform transition hover:scale-105"
              onClick={() => setIsVisible(false)}
            >
              🛒 Claim 25% OFF Now!
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-green-300 text-green-700 hover:bg-green-50"
              onClick={() => setIsVisible(false)}
            >
              Continue Browsing
            </Button>
          </div>

          {/* Promo Code */}
          <div className="text-center mt-3">
            <p className="text-xs text-gray-600">
              Use code: <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded">WELCOME25</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}