import { openai } from "@ai-sdk/openai";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import { streamText, tool } from "ai";
import { z } from "zod";
import { calculatorTool } from "@/lib/tools/calculator-tool";

export const runtime = "edge";
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, system, tools, instructions } = await req.json();
  
  // 檢查是否是標題生成請求
  const isGeneratingTitle = detectTitleGenerationRequest(messages, system);
  
  if (isGeneratingTitle) {
    return handleTitleGeneration(messages);
  }
  
  // 合併系統提示和動態指令
  const combinedSystem = [
    system || "",
    instructions || "", // 動態指令
  ].filter(Boolean).join("\n\n");
  
  // 調試用：記錄動態指令
  if (instructions) {
    console.log("🎯 API 收到動態指令:", instructions);
    console.log("🎯 完整系統提示:", combinedSystem);
  } else {
    console.log("❌ 未收到動態指令");
  }

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    toolCallStreaming: true,
    system: [
      combinedSystem,
      "",
      "你是一個智能 AI 助手，擁有多種工具能力：",
      "- getWeather: 查詢天氣資訊（會要求用戶確認）",
      "- calculator: 數學計算，無需確認", 
      "- navigationGuide: 網頁導航助手（會要求用戶確認）- 傳統工具",
      "- navigateToPage: 智能頁面導航（直接執行）- 新智能工具",
      "- pageAction: 頁面操作（滾動、刷新）- 新智能工具",
      "- generateText: 生成創意文本（詩歌、故事等）",
      "- randomFact: 獲取隨機有趣事實",
      "",
      "**智能組件功能（新）：**",
      "在 Demo 頁面中，你可以直接與頁面元素互動：",
      "1. 直接點擊導航按鈕幫用戶切換頁面",
      "2. 理解頁面內容並提供相關建議",
      "3. 使用 navigateToPage 工具快速導航",
      "4. 使用 pageAction 工具進行頁面操作",
      "",
      "**使用建議：**",
      "- 頁面導航：優先使用智能按鈕或 navigateToPage",
      "- 頁面操作：使用 pageAction 工具",
      "- 複雜導航：仍可使用傳統 navigationGuide（有確認機制）",
      "",
      "當用戶想要查看 Demo 功能或 AssistantSidebar 展示時，引導他們到 demo 頁面。",
      "在 Demo 頁面中，你可以展示智能組件的強大功能！"
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
      
      // 需要確認的網頁導航工具（沒有 execute，由前端處理確認）
      navigationGuide: tool({
        description: "引導用戶導航到應用的不同頁面或功能區域，支持基本導航和 Demo 頁面的子頁面導航",
        parameters: z.object({
          target: z.enum([
            "homepage", "chat", "top", "bottom", "refresh", 
            "demo", "dashboard", "profile", "settings", "about"
          ]).describe(
            "導航目標：homepage=首頁, chat=聊天頁面, top=頁面頂部, bottom=頁面底部, refresh=刷新頁面, " +
            "demo=Demo展示頁面, dashboard=儀表板, profile=個人資料, settings=設定, about=關於我們"
          ),
          reason: z.string().describe("導航原因或用戶請求的描述"),
        }),
        // 沒有 execute 函數，讓前端處理確認和執行
      }),

      // 新的智能導航工具（有 execute，直接執行）
      navigateToPage: tool({
        description: "智能頁面導航工具，直接切換到指定頁面（無需確認）",
        parameters: z.object({
          pageId: z.enum(['dashboard', 'profile', 'settings', 'about']).describe('要導航的頁面 ID'),
          reason: z.string().describe('導航原因'),
        }),
        execute: async ({ pageId, reason }) => {
          // 這個工具會被前端的 SmartPageNavigationTool 攔截並執行
          return { 
            success: true, 
            message: `導航到 ${pageId} 頁面`,
            pageId,
            reason 
          };
        },
      }),

      // 新的頁面操作工具（有 execute，直接執行）
      pageAction: tool({
        description: "頁面操作工具，執行滾動和刷新操作（無需確認）",
        parameters: z.object({
          action: z.enum(['scroll_to_top', 'scroll_to_bottom', 'refresh_page']).describe('頁面操作類型'),
          reason: z.string().describe('執行原因'),
        }),
        execute: async ({ action, reason }) => {
          // 這個工具會被前端的 SmartPageActionTool 攔截並執行
          return { 
            success: true, 
            message: `執行 ${action} 操作`,
            action,
            reason 
          };
        },
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

// 檢測是否是標題生成請求
function detectTitleGenerationRequest(messages: unknown[], system?: string): boolean {
  // assistant-ui 的 generateTitle() 會發送特殊的系統提示
  const isAssistantUITitleRequest = system?.includes("Generate a title") || 
                                    system?.includes("generate title") ||
                                    system?.includes("Generate a concise title") ||
                                    system?.includes("title generation");
  
  // 檢查是否有足夠的對話內容
  const hasConversation = messages && messages.length >= 2;
  
  // 檢查特殊的請求標記
  const hasSpecialMarker = system?.includes("__TITLE_GENERATION__");
  
  return Boolean(isAssistantUITitleRequest || hasSpecialMarker || 
         (hasConversation && system?.toLowerCase()?.includes("title")));
}

// 處理標題生成請求
async function handleTitleGeneration(messages: unknown[]) {
  try {
    console.log("🎯 處理標題生成請求...");
    
    // 直接使用我們的標題生成邏輯（避免循環請求）
    const { openai } = await import("@ai-sdk/openai");
    const { generateObject } = await import("ai");
    const { z } = await import("zod");
    
    if (!messages || messages.length === 0) {
      throw new Error("No messages provided");
    }

    // 取最近的幾條消息來分析
    const recentMessages = messages.slice(-6);
    
    // 構建用於分析的上下文
    const conversationContext = recentMessages
      .map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`)
      .join('\n');

    // 標題生成的 schema
    const titleSchema = z.object({
      title: z.string().min(2).max(50).describe("對話的簡潔標題，2-8個中文字或2-6個英文詞"),
    });

    // 使用 generateObject 確保結構化輸出
    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      prompt: `請基於以下對話內容生成一個簡潔有意義的標題：

${conversationContext}

要求：
- 中文標題：2-8個字
- 英文標題：2-6個詞  
- 體現對話的核心話題
- 避免使用「新對話」、「聊天」等無意義的詞語
- 如果是技術討論，使用具體的技術術語
- 如果是問答，突出關鍵問題
- 保持簡潔專業`,
      schema: titleSchema,
    });

    const title = result.object.title;
    console.log("✅ 標題生成成功:", title);
    
    // 返回符合 assistant-ui 期望的格式
    return new Response(title, {
      headers: { "Content-Type": "text/plain" },
    });

  } catch (error) {
    console.error("❌ 標題生成錯誤:", error);
    return new Response("新對話", {
      headers: { "Content-Type": "text/plain" },
    });
  }
}
