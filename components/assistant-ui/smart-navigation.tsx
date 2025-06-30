"use client";

import { makeAssistantVisible, makeAssistantTool, tool, useAssistantInstructions, useAssistantRuntime } from "@assistant-ui/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React, { useEffect } from "react";
import { z } from "zod";
import { 
  Home, 
  MessageSquare, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw,
  Layout,
  User,
  Settings,
  Info
} from "lucide-react";

// 1. 智能按鈕組件 - 使用 makeAssistantVisible
export const SmartButton = makeAssistantVisible(
  ({ onClick, children, variant = "ghost", size = "sm", className, ...props }: any) => (
    <Button
      onClick={onClick}
      variant={variant}
      size={size}
      className={className}
      {...props}
    >
      {children}
    </Button>
  ),
  { 
    clickable: false,
    // 讓 AI 能夠理解按鈕的功能
  }
);

// 2. 頁面導航工具 - 使用 makeAssistantTool (保留確認機制)
const pageNavigationTool = tool({
  parameters: z.object({
    pageId: z.enum(['dashboard', 'profile', 'settings', 'about']).describe('要導航的頁面 ID'),
    reason: z.string().describe('導航原因'),
  }),
  execute: async ({ pageId, reason }) => {
    // 檢查是否在 demo 頁面
    if (typeof window !== 'undefined' && (window as any).navigateToPage) {
      const success = (window as any).navigateToPage(pageId);
      if (success) {
        return { 
          success: true, 
          message: `已成功導航到${pageId}頁面`,
          reason 
        };
      }
    }
    return { 
      success: false, 
      message: '導航失敗，請確認當前在 demo 頁面',
      reason 
    };
  },
});

// 3. 頁面操作工具 - 不需要確認的簡單操作
const pageActionTool = tool({
  parameters: z.object({
    action: z.enum(['scroll_to_top', 'scroll_to_bottom', 'refresh_page']).describe('頁面操作類型'),
    reason: z.string().describe('執行原因'),
  }),
  execute: async ({ action, reason }) => {
    if (typeof window === 'undefined') {
      return { success: false, message: '無法在服務端執行此操作' };
    }

    try {
      switch (action) {
        case 'scroll_to_top':
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return { success: true, message: '已滾動到頁面頂部', reason };
        
        case 'scroll_to_bottom':
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          return { success: true, message: '已滾動到頁面底部', reason };
        
        case 'refresh_page':
          window.location.reload();
          return { success: true, message: '正在刷新頁面...', reason };
        
        default:
          return { success: false, message: '未知的操作類型' };
      }
    } catch (error) {
      return { success: false, message: `操作失敗: ${error}` };
    }
  },
});

// 4. 智能導航工具組件
export const SmartPageNavigationTool = makeAssistantTool({
  ...pageNavigationTool,
  toolName: "navigateToPage",
});

export const SmartPageActionTool = makeAssistantTool({
  ...pageActionTool,
  toolName: "pageAction",
});

// 5. 智能導航區域組件
interface SmartNavigationProps {
  currentPage: string;
  pages: Record<string, { title: string; content: React.ReactNode }>;
  setCurrentPage: (page: any) => void;
}

export function SmartNavigation({ currentPage, pages, setCurrentPage }: SmartNavigationProps) {
  const assistantRuntime = useAssistantRuntime();

  // 使用 useAssistantInstructions 添加頁面級指令
  useAssistantInstructions(`
    你是一個智能導航助手，幫助用戶在 Demo 應用中導航：
    
    **可用功能：**
    1. 直接點擊導航按鈕幫用戶切換頁面
    2. 使用 navigateToPage 工具切換到指定頁面
    3. 使用 pageAction 工具執行頁面操作（滾動、刷新）
    
    **頁面說明：**
    - dashboard: 儀表板 - 顯示統計數據和概覽
    - profile: 個人資料 - 用戶信息和設定
    - settings: 系統設定 - 通知和隱私設定  
    - about: 關於我們 - 公司介紹和團隊信息
    
    **使用建議：**
    - 對於頁面導航，優先直接點擊按鈕
    - 對於滾動和刷新，使用 pageAction 工具
    - 根據用戶意圖選擇最適當的方式
  `);

  // 使用 Model Context 提供動態頁面狀態
  useEffect(() => {
    return assistantRuntime.registerModelContextProvider({
      getModelContext: () => ({
        system: `
          **當前頁面狀態：**
          - 目前頁面：${currentPage} (${pages[currentPage]?.title})
          - 可用頁面：${Object.entries(pages).map(([id, page]) => `${id}(${page.title})`).join(', ')}
          - 頁面總數：${Object.keys(pages).length}
        `,
      }),
    });
  }, [currentPage, pages, assistantRuntime]);

  const getPageIcon = (pageId: string) => {
    switch (pageId) {
      case 'dashboard': return <Layout className="w-4 h-4" />;
      case 'profile': return <User className="w-4 h-4" />;
      case 'settings': return <Settings className="w-4 h-4" />;
      case 'about': return <Info className="w-4 h-4" />;
      default: return <Home className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-64 bg-muted/50 border-r p-4">
      <h2 className="text-lg font-semibold mb-4">智能導航</h2>
      
      {/* 智能導航按鈕 */}
      <nav className="space-y-2 mb-6">
        {Object.entries(pages).map(([key, page]) => (
          <SmartButton
            key={key}
            variant={currentPage === key ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => setCurrentPage(key)}
          >
            {getPageIcon(key)}
            <span className="ml-2">{page.title}</span>
          </SmartButton>
        ))}
      </nav>

      {/* 頁面操作區域 */}
      <Card className="p-3 mb-4">
        <h3 className="text-sm font-medium mb-2">頁面操作</h3>
        <div className="grid grid-cols-2 gap-2">
          <SmartButton
            variant="outline"
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ArrowUp className="w-3 h-3 mr-1" />
            置頂
          </SmartButton>
          <SmartButton
            variant="outline"
            size="sm"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          >
            <ArrowDown className="w-3 h-3 mr-1" />
            置底
          </SmartButton>
          <SmartButton
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="col-span-2"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            刷新頁面
          </SmartButton>
        </div>
      </Card>

      {/* AI 助手提示 */}
      <Card className="p-3">
        <h3 className="text-sm font-medium mb-2">🤖 AI 助手</h3>
        <p className="text-xs text-muted-foreground mb-2">
          嘗試說：
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• "帶我到設定頁面"</li>
          <li>• "回到儀表板"</li>
          <li>• "滾動到頁面頂部"</li>
          <li>• "刷新這個頁面"</li>
        </ul>
      </Card>
    </div>
  );
}

// 6. 智能頁面容器組件
interface SmartPageContainerProps {
  children: React.ReactNode;
  pageTitle: string;
}

export function SmartPageContainer({ children, pageTitle }: SmartPageContainerProps) {
  // 為每個頁面添加特定指令
  useAssistantInstructions(`
    **當前頁面：${pageTitle}**
    
    你現在在 ${pageTitle} 頁面，可以：
    1. 解釋這個頁面的功能和內容
    2. 幫助用戶理解頁面上的信息
    3. 建議如何使用這個頁面的功能
    4. 根據需要導航到其他相關頁面
  `);

  return (
    <div className="flex-1 p-8 overflow-auto">
      {children}
    </div>
  );
}