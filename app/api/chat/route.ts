import { openai } from "@ai-sdk/openai";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import { streamText, tool } from "ai";
import { z } from "zod";
import { calculatorTool } from "@/lib/tools";

export const runtime = "edge";
export const maxDuration = 30;



export async function POST(req: Request) {
  const { messages, system, tools } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    toolCallStreaming: true,
    system: [
      system || "",
      "你是一個 AI 助手，擁有多種工具能力：",
      "- getWeather: 查詢天氣資訊（會要求用戶確認）",
      "- calculator: 數學計算，無需確認", 
      "- navigationGuide: 網頁導覽助手（會要求用戶確認）",
      "",
      "當用戶詢問天氣時，直接使用 getWeather 工具，系統會自動要求用戶確認。",
      "當用戶詢問如何找到頁面、想要前往某處、或需要導覽時，使用 navigationGuide 工具。"
    ].join("\n"),
    tools: {
      ...frontendTools(tools),
      // 需要確認的天氣工具（沒有 execute，由前端處理確認）
      getWeather: tool({
        description: "查詢指定城市的天氣資訊",
        parameters: z.object({
          location: z.string().describe("城市名稱，如：紐約、東京、台北"),
          unit: z.enum(["celsius", "fahrenheit"]).default("celsius").describe("溫度單位"),
        }),
        // 沒有 execute 函數，讓前端處理確認和執行
      }),
      
      // 需要確認的網頁導覽工具（沒有 execute，由前端處理確認）
      navigationGuide: tool({
        description: "引導用戶導航到應用的不同頁面或功能區域",
        parameters: z.object({
          target: z.enum(["homepage", "chat", "top", "bottom", "refresh"]).describe("導航目標"),
          reason: z.string().describe("導航原因或用戶請求的描述"),
        }),
        // 沒有 execute 函數，讓前端處理確認和執行
      }),
      
      calculator: calculatorTool,
      // 通用工具測試（使用 fallback UI）
      generateText: tool({
        description: "生成創意文本，如詩歌、故事、文章等",
        parameters: z.object({
          type: z.enum(["poem", "story", "article", "joke"]).describe("文本類型"),
          topic: z.string().describe("主題或關鍵詞"),
          length: z.enum(["short", "medium", "long"]).default("medium").describe("長度"),
        }),
        execute: async ({ type, topic, length }) => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const templates = {
            poem: `關於${topic}的詩歌：\n\n在${topic}的世界裡\n靜靜流淌著時間\n每一刻都是永恆\n每一瞬都值得珍藏`,
            story: `${topic}的故事：\n\n從前有一個關於${topic}的故事，這個故事充滿了奇幻色彩...`,
            article: `${topic}專題文章：\n\n${topic}是一個值得深入探討的主題，它涉及到多個層面...`,
            joke: `${topic}笑話：\n\n為什麼${topic}總是很開心？因為它知道生活的真諦！😄`
          };
          
          return {
            type,
            topic,
            length,
            content: templates[type] || `關於${topic}的內容`,
            wordCount: length === "short" ? 50 : length === "medium" ? 150 : 300,
            generatedAt: new Date().toISOString(),
          };
        },
      }),
      
      randomFact: tool({
        description: "獲取隨機有趣的事實或冷知識",
        parameters: z.object({
          category: z.enum(["science", "history", "nature", "technology", "random"]).default("random").describe("事實類別"),
        }),
        execute: async ({ category }) => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const facts = {
            science: "蜂蜜永遠不會腐壞。考古學家發現了3000年前的蜂蜜，仍然可以食用！",
            history: "拿破崙並不矮，他的身高約1.7米，在當時算是中等身材。",
            nature: "章魚有三顆心臟和藍色的血液。",
            technology: "第一個電腦程式錯誤（bug）是由真的蟲子引起的。",
            random: "香蕉是莓果，但草莓不是。"
          };
          
          return {
            category,
            fact: facts[category] || facts.random,
            source: "有趣事實資料庫",
            verified: true,
            tags: [category, "有趣", "冷知識"],
          };
        },
      }),
    },
    onError: console.log,
  });

  return result.toDataStreamResponse();
}
