import { tool } from "ai";
import { z } from "zod";

// 天氣查詢參數 schema
const weatherSchema = z.object({
  location: z.string().describe("城市名稱，例如：台北、東京、紐約"),
  unit: z.enum(["celsius", "fahrenheit"]).default("celsius").describe("溫度單位"),
});

// 移除未使用的 weatherResultSchema

export type WeatherInput = z.infer<typeof weatherSchema>;
export type WeatherResult = {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  executionTime: number;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    description: string;
    icon: string;
  }>;
};

// 模擬天氣 API 調用
export async function simulateWeatherAPI(params: WeatherInput): Promise<WeatherResult> {
  const startTime = Date.now();
  
  // 模擬 API 延遲
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 模擬天氣數據
  const weatherData = {
    "台北": { temp: 25, desc: "多雲時晴", humidity: 65, wind: 12, icon: "partly-cloudy" },
    "東京": { temp: 18, desc: "晴朗", humidity: 55, wind: 8, icon: "sunny" },
    "紐約": { temp: 12, desc: "小雨", humidity: 80, wind: 15, icon: "rainy" },
  };
  
  const locationKey = params.location as keyof typeof weatherData;
  const data = weatherData[locationKey] || weatherData["台北"];
  
  // 轉換溫度單位
  const temperature = params.unit === "fahrenheit" 
    ? Math.round(data.temp * 9/5 + 32) 
    : data.temp;
  
  const result: WeatherResult = {
    location: params.location,
    temperature,
    description: data.desc,
    humidity: data.humidity,
    windSpeed: data.wind,
    icon: data.icon,
    forecast: [
      { day: "今天", high: temperature + 3, low: temperature - 5, description: data.desc, icon: data.icon },
      { day: "明天", high: temperature + 1, low: temperature - 3, description: "晴朗", icon: "sunny" },
      { day: "後天", high: temperature - 2, low: temperature - 8, description: "多雲", icon: "cloudy" },
    ],
    executionTime: Date.now() - startTime,
  };
  
  return result;
}

// 建立 assistant-ui 工具
export const weatherTool = tool({
  description: "查詢指定城市的天氣資訊，包含溫度、濕度、風速和未來預報",
  parameters: weatherSchema,
  execute: async (params) => {
    return await simulateWeatherAPI(params);
  },
}); 