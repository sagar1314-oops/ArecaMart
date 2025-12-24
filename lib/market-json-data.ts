export const marketData = {
  Columns: [
    {
      ArrayID: 1,
      SortingID: 1,
      ColumnName: "todaysPrice",
      HeaderName: "Today's Price",
      Hide: "false",
    },
    {
      ArrayID: 2,
      SortingID: 2,
      ColumnName: "yesterdaysPrice",
      HeaderName: "Yesterday's Price",
      Hide: "false",
    },
    {
      ArrayID: 3,
      SortingID: 3,
      ColumnName: "weeklyAvgPrice",
      HeaderName: "Weekly Average Price",
      Hide: "false",
    },
    {
      ArrayID: 4,
      SortingID: 4,
      ColumnName: "monthlyAvgPrice",
      HeaderName: "Monthly Average Price",
      Hide: "false",
    },
  ],
  data: [
    {
      todaysPrice: "₹57,729",
      yesterdaysPrice: "₹57,000",
      weeklyAvgPrice: "₹55,801",
      monthlyAvgPrice: "₹48,613",
      dayBeforeYesterdaysPrice: "₹58,150",
      lastWeeklyAvgPrice: "₹54,200",
      lastMonthlyAvgPrice: "₹45,000",
    },
  ],
} as const;
