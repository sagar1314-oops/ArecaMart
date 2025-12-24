export interface GuideFactor {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface HelpSection {
  title: string;
  description: string;
  primaryCta: {
    label: string;
    link: string;
  };
  secondaryContact: {
    label: string;
    phone: string;
  };
}

export interface ArecanutGuideData {
  title: string;
  subtitle: string;
  factors: GuideFactor[];
  helpSection: HelpSection;
}

export const arecanutGuideData: ArecanutGuideData = {
  title: "How to Choose the Right Arecanut Plant?",
  subtitle:
    "Selecting the right variety is crucial for a successful harvest. Here are key factors to consider:",
  factors: [
    {
      id: "climate-soil-compatibility",
      title: "Climate & Soil Compatibility",
      description:
        "Choose varieties suited to your region's rainfall pattern and soil type. Dwarf varieties work well in limited space.",
      icon: "check-circle",
    },
    {
      id: "yield-disease-resistance",
      title: "Yield & Disease Resistance",
      description:
        "High-yield varieties like Mangala and Sreemangala offer better returns. Look for disease-resistant options.",
      icon: "trending-up",
    },
    {
      id: "maturity-period",
      title: "Maturity Period",
      description:
        "Consider the time to first harvest. Some varieties start bearing in 5–6 years, while others may take longer.",
      icon: "clock",
    },
  ],
  helpSection: {
    title: "Need Help Choosing?",
    description:
      "Our experts are here to help you select the best variety for your farm.",
    primaryCta: {
      label: "Contact Our Experts",
      link: "/contact",
    },
    secondaryContact: {
      label: "Call / WhatsApp",
      phone: "+918123456789",
    },
  },
};
