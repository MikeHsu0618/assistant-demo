"use client";

import { makeAssistantToolUI } from "@assistant-ui/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, XCircle, Thermometer, Droplets, Wind } from "lucide-react";

type WeatherArgs = {
  location: string;
  unit: "celsius" | "fahrenheit";
};

type WeatherResult = {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  forecast?: Array<{
    day: string;
    high: number;
    low: number;
    description: string;
    icon: string;
  }>;
  executionTime?: number;
  error?: string;
};

// 模擬天氣 API 調用
async function fetchWeatherData(args: WeatherArgs): Promise<WeatherResult> {
  const startTime = Date.now();
  
  // 模擬 API 延遲
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 模擬天氣數據
  const weatherData = {
    "紐約": { temp: 12, desc: "小雨", humidity: 80, wind: 15, icon: "rainy" },
    "東京": { temp: 18, desc: "晴朗", humidity: 55, wind: 8, icon: "sunny" },
    "台北": { temp: 25, desc: "多雲時晴", humidity: 65, wind: 12, icon: "partly-cloudy" },
    "倫敦": { temp: 8, desc: "陰天", humidity: 75, wind: 10, icon: "cloudy" },
    "巴黎": { temp: 15, desc: "晴朗", humidity: 60, wind: 6, icon: "sunny" },
    "New York": { temp: 12, desc: "小雨", humidity: 80, wind: 15, icon: "rainy" },
    "Tokyo": { temp: 18, desc: "晴朗", humidity: 55, wind: 8, icon: "sunny" },
    "London": { temp: 8, desc: "陰天", humidity: 75, wind: 10, icon: "cloudy" },
    "Paris": { temp: 15, desc: "晴朗", humidity: 60, wind: 6, icon: "sunny" },
  };
  
  const locationKey = args.location as keyof typeof weatherData;
  const data = weatherData[locationKey] || weatherData["台北"];
  
  // 轉換溫度單位
  const temperature = args.unit === "fahrenheit" 
    ? Math.round(data.temp * 9/5 + 32) 
    : data.temp;
  
  const executionTime = Date.now() - startTime;
  
  return {
    location: args.location,
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
    executionTime,
  };
}

const WeatherConfirmComponent = ({ args, result, addResult }: {
  args: WeatherArgs,
  result?: WeatherResult,
  addResult: (result: WeatherResult) => void
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // 如果已經有結果，顯示天氣資訊
  if (result) {
    if (result.error) {
      return (
        <Card className="border-red-200 bg-red-50 max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-800 text-base">查詢失敗</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 text-sm">{result.error}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-blue-200 bg-blue-50 max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-800 text-base">
              {result.location} 天氣資訊 ✅
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-3xl font-bold text-blue-900">
                {result.temperature}°{args.unit === "celsius" ? "C" : "F"}
              </p>
              <p className="text-blue-700 font-medium">{result.description}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Droplets className="h-4 w-4 text-blue-600" />
                <span>濕度 {result.humidity}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Wind className="h-4 w-4 text-blue-600" />
                <span>風速 {result.windSpeed} km/h</span>
              </div>
            </div>
          </div>
          
          {result.forecast && (
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium text-blue-800 mb-2">未來預報</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {result.forecast.map((day, i) => (
                  <div key={i} className="text-center bg-white/50 rounded p-2">
                    <div className="font-medium">{day.day}</div>
                    <div className="text-gray-600">{day.high}° / {day.low}°</div>
                    <div className="text-gray-500">{day.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {result.executionTime && (
            <div className="text-xs text-gray-500 border-t pt-2">
              查詢耗時：{result.executionTime}ms
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // 顯示確認界面
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const weatherResult = await fetchWeatherData(args);
      addResult(weatherResult);
    } catch {
      addResult({
        location: args.location,
        temperature: 0,
        description: "",
        humidity: 0,
        windSpeed: 0,
        icon: "",
        error: "查詢天氣時發生錯誤",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = () => {
    addResult({
      location: args.location,
      temperature: 0,
      description: "",
      humidity: 0,
      windSpeed: 0,
      icon: "",
      error: "用戶取消了天氣查詢",
    });
  };

  if (isLoading) {
    return (
      <Card className="border-blue-200 bg-blue-50 max-w-md">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-blue-700">正在查詢 {args.location} 的天氣...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50 max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-amber-800 text-base">工具調用確認</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-amber-600" />
            <span><strong>查詢城市：</strong>{args.location}</span>
          </div>
          <div>
            <strong>溫度單位：</strong>{args.unit === "celsius" ? "攝氏度 (°C)" : "華氏度 (°F)"}
          </div>
          <div className="text-gray-600 text-xs mt-2">
            即將調用天氣查詢 API 獲取實時天氣資訊
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            ✓ 確認查詢
          </Button>
          <Button
            onClick={handleReject}
            disabled={isLoading}
            variant="destructive"
            className="flex-1"
            size="sm"
          >
            ✗ 取消
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const WeatherConfirmUI = makeAssistantToolUI<WeatherArgs, WeatherResult>({
  toolName: "getWeather",
  render: WeatherConfirmComponent,
}); 