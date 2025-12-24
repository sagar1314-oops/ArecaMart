import Link from "next/link";
import { Truck, Award, Shield, Headphones } from "lucide-react";
import { featuresData } from "@/lib/features-data";

export function Footer() {
  return (
    <footer className="w-full border-t bg-green-50/95 dark:bg-green-950/95 backdrop-blur supports-[backdrop-filter]:bg-green-50/60 dark:supports-[backdrop-filter]:bg-green-950/60">
      {/* Features Section */}
      <div className="w-full py-4 bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-50">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuresData.map((feature) => {
              const Icon =
                feature.icon === "truck"
                  ? Truck
                  : feature.icon === "award"
                  ? Award
                  : feature.icon === "shield-check"
                  ? Shield
                  : Headphones;

              return (
                <div
                  key={feature.id}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center mb-2">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-green-800 dark:text-green-200 mt-1 hidden md:block">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container flex h-16 items-center justify-between px-4">
        <p className="text-sm md:text-base text-muted-foreground font-medium">
          Built for Arecanut Farmers. &copy; {new Date().getFullYear()}{" "}
          ArecaMart.
        </p>
        <div className="flex gap-4">
          <Link
            href="/terms"
            className="text-sm md:text-base text-muted-foreground hover:underline font-medium"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-sm md:text-base text-muted-foreground hover:underline font-medium"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
