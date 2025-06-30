"use client";

import { makeAssistantToolUI } from "@assistant-ui/react";
import { Loader2, Calculator, CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalculatorInput, CalculatorResult } from "@/lib/tools/calculator-tool";

// 載入狀態元件
const LoadingState = ({ expression }: { expression: string }) => (
  <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
    <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-emerald-900">
        正在計算：{expression}
      </span>
      <span className="text-xs text-emerald-600">
        <Clock className="inline h-3 w-3 mr-1" />
        分析表達式並執行運算...
      </span>
    </div>
  </div>
);

// 錯誤狀態元件
const ErrorState = ({ expression }: { expression: string }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex items-center gap-2 text-red-800">
      <XCircle className="h-5 w-5" />
      <span className="text-sm font-medium">
        計算失敗：{expression}
      </span>
    </div>
  </div>
);

// 步驟顯示元件
const CalculationStep = ({ step, index, isLast }: { 
  step: { step: string; value: number | string; description: string };
  index: number;
  isLast: boolean;
}) => (
  <div className="flex items-start gap-3 py-2">
    <div className={cn(
      "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium",
      isLast ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-600"
    )}>
      {index + 1}
    </div>
    <div className="flex-1">
      <div className="text-sm font-medium text-gray-900">{step.step}</div>
      <div className="text-xs text-gray-600 mt-1">{step.description}</div>
      {step.step !== "錯誤" && (
        <div className="text-sm text-emerald-700 font-mono mt-1">
          {typeof step.value === 'number' ? step.value.toLocaleString() : step.value}
        </div>
      )}
    </div>
    {!isLast && <ArrowRight className="h-4 w-4 text-gray-400 mt-1" />}
  </div>
);

// 結果顯示元件
const CalculatorDisplay = ({ args, result }: { args: CalculatorInput; result: CalculatorResult }) => {
  const getTypeIcon = () => {
    switch (result.type) {
      case "basic": return <Calculator className="h-5 w-5 text-blue-600" />;
      case "advanced": return <Calculator className="h-5 w-5 text-purple-600" />;
      case "error": return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Calculator className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = () => {
    switch (result.type) {
      case "basic": return "border-blue-200 bg-blue-50";
      case "advanced": return "border-purple-200 bg-purple-50";  
      case "error": return "border-red-200 bg-red-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  const getTypeLabel = () => {
    switch (result.type) {
      case "basic": return "基本運算";
      case "advanced": return "進階數學函數";
      case "error": return "計算錯誤";
      default: return "計算";
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* 表達式和結果 */}
      <div className={cn("p-4 rounded-xl border", getTypeColor())}>
        <div className="flex items-start gap-3 mb-3">
          {getTypeIcon()}
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-700">{getTypeLabel()}</div>
            <div className="font-mono text-lg text-gray-900 mt-1">{result.expression}</div>
          </div>
        </div>
        
        {result.type !== "error" && (
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">結果</span>
            </div>
            <div className="font-mono text-3xl font-bold text-emerald-700 mt-2">
              {result.result.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* 計算步驟 */}
      {args.showSteps && result.steps.length > 0 && (
        <div className="bg-white border rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            計算步驟
          </h4>
          <div className="space-y-1">
            {result.steps.map((step, index) => (
              <CalculationStep
                key={index}
                step={step}
                index={index}
                isLast={index === result.steps.length - 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* 執行時間 */}
      <div className="text-xs text-gray-500 text-center">
        <Clock className="inline h-3 w-3 mr-1" />
        執行時間：{result.executionTime}ms
      </div>
    </div>
  );
};

// 建立計算器工具 UI
export const CalculatorToolUI = makeAssistantToolUI<CalculatorInput, CalculatorResult>({
  toolName: "calculator",
  render: ({ args, status, result }) => {
    // 執行中狀態
    if (status.type === "running") {
      return <LoadingState expression={args.expression} />;
    }
    
    // 錯誤狀態  
    if (status.type === "incomplete" && status.reason === "error") {
      return <ErrorState expression={args.expression} />;
    }
    
    // 完成狀態
    if (status.type === "complete" && result) {
      return <CalculatorDisplay args={args} result={result} />;
    }
    
    return null;
  },
}); 