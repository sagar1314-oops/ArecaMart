"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Mail, ChevronDown } from "lucide-react";
import { useState } from "react";
import { faqData } from "@/lib/faq-data";

export default function HelpCenter() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-16 overflow-hidden">
        {/* Background with image */}
        <div className="absolute inset-0">
          <img
            src="/help-hero-bg.png"
            alt="Help Center Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4 border border-white/20">
              24/7 Support Available
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
            <p className="text-xl text-green-50 mb-6">
              Find answers to common questions or reach out to our support team
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="tel:+918123456789"
                className="inline-flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
              <a
                href="https://wa.me/918123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 backdrop-blur-sm px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="w-full py-8 bg-background border-b">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            Contact Support
          </h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <a
              href="tel:+918123456789"
              className="flex flex-col items-center p-6 bg-green-50 dark:bg-green-950/30 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full mb-3">
                <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-1">Call Us</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Mon-Sat, 9 AM - 6 PM
              </p>
              <p className="text-green-600 dark:text-green-400 font-bold">
                +91 81234 56789
              </p>
            </a>

            <a
              href="https://wa.me/918123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 bg-green-50 dark:bg-green-950/30 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full mb-3">
                <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-1">WhatsApp</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Quick responses
              </p>
              <p className="text-green-600 dark:text-green-400 font-bold">
                +91 81234 56789
              </p>
            </a>

            <a
              href="mailto:support@arecamart.com"
              className="flex flex-col items-center p-6 bg-green-50 dark:bg-green-950/30 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full mb-3">
                <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-sm text-muted-foreground mb-2">
                24-48 hour response
              </p>
              <p className="text-green-600 dark:text-green-400 font-bold text-sm">
                support@arecamart.com
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="w-full py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              {faqData.title}
            </h2>
            <div className="space-y-4">
              {faqData.faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-green-200 dark:border-green-800 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenFaq(openFaq === faq.id ? null : faq.id)
                    }
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors"
                  >
                    <span className="font-semibold pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 transition-transform ${
                        openFaq === faq.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === faq.id && (
                    <div className="p-4 pt-0 text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="w-full py-8 bg-green-50 dark:bg-green-950/30">
        <div className="container px-4 md:px-6 text-center">
          <p className="text-muted-foreground mb-4">Still need help?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" size="lg">
                Back to Home
              </Button>
            </Link>
            <a href="tel:+918123456789">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Call Support Now
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
