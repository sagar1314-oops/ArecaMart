export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface FAQData {
  title: string;
  faqs: FAQ[];
}

export const faqData: FAQData = {
  title: "Frequently Asked Questions",
  faqs: [
    {
      id: "FAQ_1",
      question: "How do I create an account on ArecaMart?",
      answer:
        "Go to the sign-up page, enter your basic details and phone number, verify with OTP, and create your password.",
    },
    {
      id: "FAQ_2",
      question: "How can I list my arecanut for sale?",
      answer:
        "Go to the 'Sell Your Arecanut' section, click 'Start Selling Now', fill in details about your produce such as quantity, grade, location, and expected price, then submit for verification.",
    },
    {
      id: "FAQ_3",
      question: "How do I buy products from ArecaMart?",
      answer:
        "Browse products, add the required items to your cart, proceed to checkout, choose a payment method, and place your order.",
    },
    {
      id: "FAQ_4",
      question: "What payment methods are accepted?",
      answer:
        "You can pay using UPI, net banking, credit or debit cards, and supported wallet options.",
    },
    {
      id: "FAQ_5",
      question: "How long does delivery take?",
      answer:
        "Delivery time depends on your location and product type, but most orders are delivered within a few business days.",
    },
    {
      id: "FAQ_6",
      question: "How do I check current market rates?",
      answer:
        "Open the 'Market Rates' section from the top menu to view live arecanut prices for different markets.",
    },
    {
      id: "FAQ_7",
      question: "What if I receive a damaged product?",
      answer:
        "Contact support with your order details and photos of the damage so the team can arrange a replacement or refund as per policy.",
    },
    {
      id: "FAQ_8",
      question: "How do I track my order?",
      answer:
        "Go to the 'My Orders' section in your account to see live status updates and tracking information for each order.",
    },
  ],
};
