import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/PageHero";
import { TrendingUp, Users, Shield, Zap, Leaf, Bolt } from "lucide-react";
import { sellReasonsData } from "@/lib/sell-reasons-data";
import { howItWorksData } from "@/lib/how-it-works-data";

export default function SellArecanutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with two columns */}
      <div className="container px-4 py-8 md:px-6">
        <section className="w-full py-8 bg-green-900 text-white overflow-hidden relative rounded-xl shadow-lg">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/sell-hero-zoom.png"
              alt="Arecanut Farm Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 px-6 md:px-12">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-full md:w-1/2">
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                  <img
                    src="/sell-hero-zoom.png"
                    alt="Farmers in Arecanut Plantation"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  Sell Your Arecanut at Best Prices
                </h2>
                <p className="text-lg text-green-100 mb-6 leading-relaxed">
                  Connect directly with buyers across India and get competitive
                  rates for your harvest. No middlemen, transparent pricing, and
                  quick payments.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/sell/register">
                    <Button
                      size="lg"
                      className="bg-white text-green-700 hover:bg-green-50"
                    >
                      Register as Seller
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-green-200 mt-3 font-medium">
                  It’s free to join · No listing charges
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Benefits Section */}
      <section className="w-full py-4 md:py-8 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            {sellReasonsData.title}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sellReasonsData.reasons.map((reason, index) => {
              const iconColors = [
                {
                  bg: "bg-green-100 dark:bg-green-900",
                  text: "text-green-600 dark:text-green-400",
                },
                {
                  bg: "bg-blue-100 dark:bg-blue-900",
                  text: "text-blue-600 dark:text-blue-400",
                },
                {
                  bg: "bg-purple-100 dark:bg-purple-900",
                  text: "text-purple-600 dark:text-purple-400",
                },
                {
                  bg: "bg-orange-100 dark:bg-orange-900",
                  text: "text-orange-600 dark:text-orange-400",
                },
              ];
              const colors = iconColors[index % iconColors.length];

              const Icon =
                reason.icon === "trending-up"
                  ? TrendingUp
                  : reason.icon === "users"
                  ? Users
                  : reason.icon === "shield"
                  ? Shield
                  : reason.icon === "bolt"
                  ? Bolt
                  : TrendingUp;

              return (
                <div
                  key={reason.id}
                  className="flex flex-col items-center text-center p-6 border rounded-lg"
                >
                  <div className={`p-3 ${colors.bg} rounded-full mb-4`}>
                    <Icon className={`h-8 w-8 ${colors.text}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{reason.title}</h3>
                  <p className="text-muted-foreground">{reason.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-4 md:py-8 bg-muted/50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-6">
            {howItWorksData.title}
          </h2>

          <div className="max-w-4xl mx-auto space-y-6">
            {howItWorksData.steps.map((step) => (
              <div key={step.id} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm mt-1">
                  {step.order}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-4 md:py-8 bg-green-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Selling?</h2>
            <p className="text-lg text-green-50 mb-8">
              Join thousands of farmers who are already getting better prices
              for their arecanut
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sell/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-green-700 hover:bg-green-50"
                >
                  Register Now
                </Button>
              </Link>
              <Link href="/marketRates">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  View Today’s Market Rates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
