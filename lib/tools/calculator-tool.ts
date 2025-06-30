import { tool } from "ai";
import { z } from "zod";

// 計算參數 schema
const calculatorSchema = z.object({
  expression: z.string().describe("數學表達式，例如：2 + 3 * 4, sqrt(16), sin(30)"),
  showSteps: z.boolean().default(true).describe("是否顯示計算步驟"),
});

// 計算結果 schema
// 移除未使用的 Schema，改用 TypeScript 類型定義

export type CalculatorInput = z.infer<typeof calculatorSchema>;
export type CalculatorResult = {
  expression: string;
  result: number;
  steps: Array<{
    step: string;
    value: number | string;
    description: string;
  }>;
  executionTime: number;
  type: "basic" | "advanced" | "error";
};

// 安全的表達式評估
function safeEval(expression: string): { 
  result: number; 
  steps: Array<{
    step: string;
    value: string | number;
    description: string;
  }>; 
  type: "basic" | "advanced" | "error" 
} {
        const steps: Array<{
        step: string;
        value: string | number;
        description: string;
      }> = [];
  
  try {
    // 移除空白並轉為小寫
    const cleanExpr = expression.trim().toLowerCase();
    
    // 檢查是否包含進階數學函數
    const hasAdvancedMath = /sin|cos|tan|sqrt|log|ln|pow|abs/.test(cleanExpr);
    
    // 基本數學表達式（僅支援 +, -, *, /, (, )）
    if (!hasAdvancedMath && /^[0-9+\-*/().\s]+$/.test(cleanExpr)) {
      steps.push({
        step: "解析表達式",
        value: cleanExpr,
        description: "識別為基本數學運算"
      });
      
      const result = Function(`"use strict"; return (${cleanExpr})`)();
      
      steps.push({
        step: "計算結果",
        value: result,
        description: `${cleanExpr} = ${result}`
      });
      
      return { result, steps, type: "basic" };
    }
    
    // 進階數學函數處理
    if (hasAdvancedMath) {
      steps.push({
        step: "解析函數",
        value: cleanExpr,
        description: "識別為進階數學函數"
      });
      
      let processedExpr = cleanExpr;
      
      // 替換數學函數
      processedExpr = processedExpr.replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');
      processedExpr = processedExpr.replace(/sin\(([^)]+)\)/g, 'Math.sin($1 * Math.PI / 180)');
      processedExpr = processedExpr.replace(/cos\(([^)]+)\)/g, 'Math.cos($1 * Math.PI / 180)');
      processedExpr = processedExpr.replace(/tan\(([^)]+)\)/g, 'Math.tan($1 * Math.PI / 180)');
      processedExpr = processedExpr.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
      processedExpr = processedExpr.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
      processedExpr = processedExpr.replace(/abs\(([^)]+)\)/g, 'Math.abs($1)');
      
      steps.push({
        step: "轉換函數",
        value: processedExpr,
        description: "轉換為 JavaScript 數學函數"
      });
      
      const result = Function(`"use strict"; return (${processedExpr})`)();
      
      steps.push({
        step: "計算結果",
        value: Math.round(result * 1000000) / 1000000, // 保留6位小數
        description: `最終結果`
      });
      
      return { result: Math.round(result * 1000000) / 1000000, steps, type: "advanced" };
    }
    
    throw new Error("不支援的表達式格式");
    
  } catch (error) {
    steps.push({
      step: "錯誤",
      value: "計算失敗",
      description: `錯誤：${error instanceof Error ? error.message : "未知錯誤"}`
    });
    
    return { result: 0, steps, type: "error" };
  }
}

// 模擬計算操作
async function simulateCalculation(params: CalculatorInput): Promise<CalculatorResult> {
  const startTime = Date.now();
  
  // 模擬計算延遲
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const { result, steps, type } = safeEval(params.expression);
  
  const executionTime = Date.now() - startTime;
  
  return {
    expression: params.expression,
    result,
    steps: params.showSteps ? steps : [],
    executionTime,
    type,
  };
}

// 建立 assistant-ui 工具
export const calculatorTool = tool({
  description: "執行數學計算，支援基本運算和進階數學函數（sin, cos, sqrt, log等）",
  parameters: calculatorSchema,
  execute: async (params) => {
    return await simulateCalculation(params);
  },
});