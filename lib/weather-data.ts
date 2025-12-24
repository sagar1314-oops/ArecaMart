export interface WeatherData {
  district: string;
  condition: string;
  icon: "Sun" | "Cloud" | "Rain" | "CloudRain" | "CloudSun" | "CloudLightning";
  temp: number;
  minTemp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  visibility: number;
  sunrise: string;
  sunset: string;
}

export interface DayForecast {
  day: string;
  icon: "Sun" | "Cloud" | "Rain" | "CloudRain" | "CloudSun" | "CloudLightning";
  temp: number;
  rainChance: number;
}

export const MOCK_WEATHER_DATA: Record<string, WeatherData> = {
  Chitradurga: {
    district: "Chitradurga",
    condition: "Heavy Rain",
    icon: "CloudRain",
    temp: 28,
    minTemp: 24,
    feelsLike: 31,
    humidity: 85,
    windSpeed: 7.9,
    uvIndex: 4,
    visibility: 5,
    sunrise: "6:10 AM",
    sunset: "6:05 PM",
  },
  Davangere: {
    district: "Davangere",
    condition: "Cloudy",
    icon: "Cloud",
    temp: 30,
    minTemp: 22,
    feelsLike: 32,
    humidity: 78,
    windSpeed: 12.5,
    uvIndex: 5,
    visibility: 8,
    sunrise: "6:12 AM",
    sunset: "6:08 PM",
  },
  Shivamogga: {
    district: "Shivamogga",
    condition: "Sunny",
    icon: "Sun",
    temp: 32,
    minTemp: 24,
    feelsLike: 35,
    humidity: 65,
    windSpeed: 5.2,
    uvIndex: 8,
    visibility: 10,
    sunrise: "6:15 AM",
    sunset: "6:10 PM",
  },
};

export const MOCK_FORECAST: DayForecast[] = [
  { day: "Today", icon: "CloudRain", temp: 28, rainChance: 80 },
  { day: "Thu", icon: "CloudSun", temp: 31, rainChance: 40 },
  { day: "Fri", icon: "CloudRain", temp: 27, rainChance: 90 },
  { day: "Sat", icon: "CloudLightning", temp: 29, rainChance: 75 },
  { day: "Sun", icon: "Sun", temp: 32, rainChance: 10 },
  { day: "Mon", icon: "Cloud", temp: 31, rainChance: 20 },
  { day: "Tue", icon: "Rain", temp: 26, rainChance: 95 },
  { day: "Wed", icon: "CloudSun", temp: 30, rainChance: 30 },
  { day: "Thu", icon: "Sun", temp: 33, rainChance: 5 },
  { day: "Fri", icon: "Cloud", temp: 31, rainChance: 15 },
];
