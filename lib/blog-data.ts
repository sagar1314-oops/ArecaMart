export interface BlogPost {
  id: string;
  slug: string;
  category: string;
  title: string;
  summary: string;
  author: string;
  publishedDate: string;
  readTimeMinutes: number;
  link: string;
  isActive?: boolean;
}

export const blogData = {
  title: "Farming Insights & News",
  subtitle:
    "Expert tips, market trends, and best practices for successful arecanut cultivation.",
  posts: [
    {
      id: "best-practices-arecanut-cultivation",
      category: "Cultivation",
      title: "Best Practices for Arecanut Cultivation",
      summary:
        "Learn the expert tips for planting, watering, and maintaining your Arecanut plantation for maximum yield.",
      author: "Dr. K. Sharma",
      publishedDate: "2023-10-15",
      readTimeMinutes: 3,
      link: "/blog/best-practices-arecanut-cultivation",
    },
    {
      id: "market-price-fluctuations",
      category: "Market News",
      title: "Understanding Market Price Fluctuations",
      summary:
        "Why do Arecanut prices change? An overview of the key factors affecting market trends in Karnataka.",
      author: "Market Analyst",
      publishedDate: "2023-11-02",
      readTimeMinutes: 2,
      link: "/blog/market-price-fluctuations",
    },
    {
      id: "organic-vs-chemical-fertilizers",
      category: "Farming Tips",
      title: "Organic vs Chemical Fertilizers",
      summary:
        "A comprehensive comparison to help you choose the right nutrition plan for your Arecanut trees.",
      author: "Agri Expert",
      publishedDate: "2023-09-28",
      readTimeMinutes: 2,
      link: "/blog/organic-vs-chemical-fertilizers",
    },
    {
      id: "pest-management-arecanut-farms",
      category: "Disease Control",
      title: "Pest Management in Arecanut Farms",
      summary:
        "Identify common pests like mites and borers and learn effective control measures.",
      author: "Plant Pathologist",
      publishedDate: "2023-08-10",
      readTimeMinutes: 2,
      link: "/blog/pest-management-arecanut-farms",
    },
  ],
};
