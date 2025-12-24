"use client";

import { Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";

interface Testimonial {
  id: number;
  name: string;
  location: string | null;
  role: string | null;
  rating: number;
  quote: string;
  avatar_url: string | null;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch("/api/testimonials");
        const data = await response.json();
        if (data.success) {
          setTestimonials(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full py-8 bg-green-50/50 dark:bg-green-950/20">
        <div className="container px-4 md:px-6">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded mb-10"></div>
            <div className="grid md:grid-cols-3 gap-6 w-full">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="w-full py-8 bg-green-50/50 dark:bg-green-950/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Stories from Our Farming Community
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Hear from fellow farmers who have transformed their business with
            ArecaMart.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-background rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow relative flex flex-col"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-green-100 dark:text-green-900" />

              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-green-100">
                  <img
                    src={testimonial.avatar_url || "/avatars/default.png"}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
              </div>

              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-muted-foreground text-sm italic flex-1">
                "{testimonial.quote}"
              </p>

              <div className="mt-4 pt-4 border-t w-full text-left">
                <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/50 px-2 py-1 rounded-full">
                  {testimonial.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
