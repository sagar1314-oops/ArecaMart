export interface HomeHowItWorksStep {
  id: string;
  order: number;
  title: string;
  description: string;
  icon: string;
}

export interface HomeHowItWorksData {
  title: string;
  subtitle: string;
  steps: HomeHowItWorksStep[];
}

export const homeHowItWorksData: HomeHowItWorksData = {
  title: "How ArecaMart Works",
  subtitle:
    "Simple steps to get started with India's first online Arecanut marketplace.",
  steps: [
    {
      id: "FLOW_1",
      order: 1,
      title: "Sign Up",
      description:
        "Create your account in seconds using just your phone number.",
      icon: "phone-signup",
    },
    {
      id: "FLOW_2",
      order: 2,
      title: "List or Order",
      description:
        "Farmers can list produce to sell. Buyers can order farm essentials.",
      icon: "farmer-and-shop",
    },
    {
      id: "FLOW_3",
      order: 3,
      title: "Get Paid / Delivery",
      description:
        "Receive fast payments for sales or quick delivery for your orders.",
      icon: "truck-and-rupee",
    },
  ],
};
