import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const runtime = "edge";
export const maxDuration = 30;

// 標題生成的 schema
const titleSchema = z.object({
  title: z.string().min(2).max(50).describe("對話的簡潔標題，2-8個中文字或2-6個英文詞"),
});

interface Message {
  role: string;
  content: any; // 可能是字符串或數組格式
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();
    
    if (!messages || messages.length === 0) {
      return Response.json({ error: "No messages provided" }, { status: 400 });
    }

    // 取最近的幾條消息來分析
    const recentMessages = messages.slice(-6); // 最多取6條消息
    
    // 構建用於分析的上下文，正確提取文本內容
    const conversationContext = recentMessages
      .map((msg: Message) => `${msg.role}: ${extractTextFromContent(msg.content)}`)
      .join('\n');

    // 使用 generateObject 確保結構化輸出
    const result = await generateObject({
      model: openai("gpt-4o-mini"), // 使用更便宜的模型
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

    return Response.json({ 
      title: result.object.title,
      success: true 
    });

  } catch (error) {
    console.error("標題生成失敗:", error);
    return Response.json({ 
      title: "新對話", 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// 從消息內容中提取文本
function extractTextFromContent(content: any): string {
  if (typeof content === "string") {
    return content;
  }
  
  if (Array.isArray(content)) {
    return content
      .filter((part: any) => part.type === "text")
      .map((part: any) => part.text)
      .join(" ");
  }
  
  return "";
}