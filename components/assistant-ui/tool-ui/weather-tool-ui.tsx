"use client";

import { makeAssistantToolUI } from "@assistant-ui/react";
import { Loader2, CloudRain, Sun, Cloud, Wind, Droplets, Clock } from "lucide-react";
// import { cn } from "@/lib/utils"; // 暫時不使用
import type { WeatherInput, WeatherResult } from "@/lib/tools/weather-tool";

// 天氣圖示映射
const weatherIcons = {
  "sunny": Sun,
  "cloudy": Cloud,
  "partly-cloudy": Cloud,
  "rainy": CloudRain,
};

// 載入狀態元件
const LoadingState = ({ location }: { location: string }) => (
  <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-blue-900">
        正在查詢 {location} 的天氣資訊...
      </span>
      <span className="text-xs text-blue-600">
        <Clock className="inline h-3 w-3 mr-1" />
        預計需要 1-2 秒
      </span>
    </div>
  </div>
);

// 錯誤狀態元件
const ErrorState = ({ location }: { location: string }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex items-center gap-2 text-red-800">
      <span className="text-sm font-medium">
        無法取得 {location} 的天氣資訊
      </span>
    </div>
  </div>
);

// 結果顯示元件
const WeatherDisplay = ({ args, result }: { args: WeatherInput; result: WeatherResult }) => {
  const IconComponent = weatherIcons[result.icon as keyof typeof weatherIcons] || Cloud;
  
  return (
    <div className="max-w-md mx-auto">
      {/* 主要天氣卡片 */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">{result.location}</h3>
            <p className="text-blue-100 text-sm">{result.description}</p>
          </div>
          <IconComponent className="h-12 w-12 text-blue-100" />
        </div>
        
        <div className="text-4xl font-bold mb-4">
          {result.temperature}°{args.unit === "celsius" ? "C" : "F"}
        </div>
        
        {/* 詳細資訊 */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            <span>濕度 {result.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4" />
            <span>風速 {result.windSpeed} km/h</span>
          </div>
        </div>
      </div>
      
      {/* 未來預報 */}
      <div className="mt-4 bg-white border rounded-xl p-4 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-3">未來預報</h4>
        <div className="space-y-2">
          {result.forecast.map((day, index) => {
            const DayIcon = weatherIcons[day.icon as keyof typeof weatherIcons] || Cloud;
            return (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <DayIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{day.day}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{day.high}°</span>
                  <span className="text-gray-400">/</span>
                  <span>{day.low}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* 執行時間 */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        <Clock className="inline h-3 w-3 mr-1" />
        執行時間：{result.executionTime}ms
      </div>
    </div>
  );
};

// 建立天氣工具 UI
export const WeatherToolUI = makeAssistantToolUI<WeatherInput, WeatherResult>({
  toolName: "getWeather",
  render: ({ args, status, result }) => {
    // 執行中狀態
    if (status.type === "running") {
      return <LoadingState location={args.location} />;
    }
    
    // 錯誤狀態
    if (status.type === "incomplete" && status.reason === "error") {
      return <ErrorState location={args.location} />;
    }
    
    // 完成狀態
    if (status.type === "complete" && result) {
      return <WeatherDisplay args={args} result={result} />;
    }
    
    return null;
  },
}); 