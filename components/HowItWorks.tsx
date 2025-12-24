"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeHowItWorksData } from "@/lib/home-how-it-works-data";

export default function HowItWorks() {
  const stepColors = [
    "bg-green-100 dark:bg-white text-green-600 dark:text-green-600",
    "bg-blue-100 dark:bg-white text-blue-600 dark:text-blue-600",
    "bg-orange-100 dark:bg-white text-orange-600 dark:text-orange-600",
  ];

  const stepImages = [
    "/how-it-works/step1.png",
    "/how-it-works/step2.png",
    "/how-it-works/step3.png",
  ];

  return (
    <section className="w-full py-8 bg-green-50/50 dark:bg-green-950/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {homeHowItWorksData.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            {homeHowItWorksData.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-4 right-4 h-0.5 border-t-2 border-dashed border-green-300/50 dark:border-green-700/50 -z-10 -translate-y-1/2 transform" />

          {homeHowItWorksData.steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center bg-background p-4 rounded-xl"
            >
              <div
                className={`w-40 h-40 rounded-full ${
                  stepColors[index % stepColors.length]
                } flex items-center justify-center mb-6 p-6 shadow-sm`}
              >
                <img
                  src={stepImages[index % stepImages.length]}
                  alt={step.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {step.order}. {step.title}
              </h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            asChild
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8"
          >
            <Link href="/account">
              Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
