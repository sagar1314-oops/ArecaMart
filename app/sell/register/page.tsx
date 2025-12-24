"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHero } from "@/components/PageHero";
import { useState } from "react";

export default function SellerRegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    farmSize: "",
    arecanutVariety: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log("Registration data:", formData);
    alert("Registration submitted! We will contact you soon.");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <PageHero
        title="Register as a Seller"
        description="Start selling your arecanut at the best market prices"
        imageSrc="/sell-hero.png"
        imageAlt="Register as Seller"
      />

      {/* Registration Form */}
      <section className="w-full py-4 bg-background">
        <div className="container px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Personal Information</h2>

                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium mb-2"
                  >
                    Full Name *
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium mb-2"
                    >
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Address Details</h2>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium mb-2"
                  >
                    Farm Address *
                  </label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address, village"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium mb-2"
                    >
                      City *
                    </label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium mb-2"
                    >
                      State *
                    </label>
                    <Input
                      id="state"
                      name="state"
                      type="text"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="pincode"
                      className="block text-sm font-medium mb-2"
                    >
                      Pincode *
                    </label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                    />
                  </div>
                </div>
              </div>

              {/* Farm Information */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Farm Information</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="farmSize"
                      className="block text-sm font-medium mb-2"
                    >
                      Farm Size (in acres) *
                    </label>
                    <Input
                      id="farmSize"
                      name="farmSize"
                      type="number"
                      required
                      value={formData.farmSize}
                      onChange={handleChange}
                      placeholder="e.g., 5"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="arecanutVariety"
                      className="block text-sm font-medium mb-2"
                    >
                      Arecanut Variety
                    </label>
                    <Input
                      id="arecanutVariety"
                      name="arecanutVariety"
                      type="text"
                      value={formData.arecanutVariety}
                      onChange={handleChange}
                      placeholder="e.g., Mangala, Sumangala"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit Registration
                </Button>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  By registering, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
