export interface HowItWorksStep {
  id: string;
  order: number;
  title: string;
  description: string;
}

export interface HowItWorksData {
  title: string;
  steps: HowItWorksStep[];
}

export const howItWorksData: HowItWorksData = {
  title: "How It Works",
  steps: [
    {
      id: "STEP_1",
      order: 1,
      title: "Register",
      description: "Sign up with basic details and verification documents.",
    },
    {
      id: "STEP_2",
      order: 2,
      title: "List Produce",
      description: "Add quantity, grade, location, and expected price.",
    },
    {
      id: "STEP_3",
      order: 3,
      title: "Get Offers",
      description: "Receive bids from verified buyers and pick the best one.",
    },
    {
      id: "STEP_4",
      order: 4,
      title: "Sell & Earn",
      description: "Arrange delivery and receive secure payment.",
    },
  ],
};
