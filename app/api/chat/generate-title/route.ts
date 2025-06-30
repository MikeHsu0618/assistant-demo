import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const runtime = "edge";
export const maxDuration = 30;

// 標題生成的 schema
const titleSchema = z.object({
  title: z.string().min(2).max(50).describe("對話的簡潔標題，2-8個中文字"),
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

    // 取最近幾條消息分析
    const recentMessages = messages.slice(-4);
    
    // 提取文本內容
    const conversationText = recentMessages
      .map(msg => `${msg.role}: ${extractTextFromContent(msg.content)}`)
      .join('\n');

    // 生成標題
    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      prompt: `分析以下對話，生成一個簡潔的中文標題（2-8個字）：

${conversationText}

要求：體現核心話題，避免「新對話」等無意義詞語。`,
      schema: titleSchema,
    });

    return Response.json({ 
      title: result.object.title 
    });

  } catch (error) {
    console.error("標題生成失敗:", error);
    return Response.json({ 
      title: "新對話"
    }, { status: 500 });
  }
}

// 提取文本內容
function extractTextFromContent(content: any): string {
  if (typeof content === "string") {
    return content;
  }
  
  if (Array.isArray(content)) {
    return content
      .filter(part => part.type === "text")
      .map(part => part.text)
      .join(" ");
  }
  
  return "";
}