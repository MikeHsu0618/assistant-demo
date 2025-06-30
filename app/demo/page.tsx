"use client";

import React, { useState } from "react";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { AssistantSidebar } from "@/components/assistant-ui/assistant-sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  CalculatorToolUI, 
  WeatherConfirmUI, 
  NavigationGuideUI,
  SmartPageNavigationTool,
  SmartPageActionTool,
  SmartNavigation,
  SmartPageContainer,
  ContextSelector
} from "@/components/assistant-ui/tool-ui";

// 頁面內容定義 (保持不變)
const pages = {
  dashboard: {
    title: "儀表板",
    content: (
      <SmartPageContainer pageTitle="儀表板">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">儀表板</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">活躍用戶</h3>
              <p className="text-3xl font-bold text-blue-600">1,234</p>
              <p className="text-sm text-muted-foreground">活躍用戶</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">銷售額</h3>
              <p className="text-3xl font-bold text-green-600">$12,345</p>
              <p className="text-sm text-muted-foreground">本月收入</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">訂單數量</h3>
              <p className="text-3xl font-bold text-purple-600">567</p>
              <p className="text-sm text-muted-foreground">待處理訂單</p>
            </Card>
          </div>
        </div>
      </SmartPageContainer>
    )
  },
  profile: {
    title: "個人資料",
    content: (
      <SmartPageContainer pageTitle="個人資料">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">個人資料</h1>
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                張
              </div>
              <div>
                <h2 className="text-xl font-semibold">張小明</h2>
                <p className="text-muted-foreground">軟體工程師</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">電子郵件</label>
                <p className="text-muted-foreground">zhang@example.com</p>
              </div>
              <div>
                <label className="text-sm font-medium">電話</label>
                <p className="text-muted-foreground">+886 912 345 678</p>
              </div>
              <div>
                <label className="text-sm font-medium">部門</label>
                <p className="text-muted-foreground">技術開發部</p>
              </div>
            </div>
          </Card>
        </div>
      </SmartPageContainer>
    )
  },
  settings: {
    title: "設定",
    content: (
      <SmartPageContainer pageTitle="設定">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">系統設定</h1>
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">通知設定</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>電子郵件通知</span>
                  <Button variant="outline" size="sm">開啟</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>推播通知</span>
                  <Button variant="outline" size="sm">關閉</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>簡訊通知</span>
                  <Button variant="outline" size="sm">開啟</Button>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">隱私設定</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>個人資料公開</span>
                  <Button variant="outline" size="sm">私人</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>活動狀態</span>
                  <Button variant="outline" size="sm">顯示</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </SmartPageContainer>
    )
  },
  about: {
    title: "關於我們",
    content: (
      <SmartPageContainer pageTitle="關於我們">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">關於我們</h1>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">公司簡介</h3>
            <p className="text-muted-foreground mb-4">
              我們是一家專注於人工智慧技術開發的創新公司，致力於為企業提供智能化解決方案。
              透過先進的機器學習和自然語言處理技術，我們幫助客戶提升效率、降低成本並創造更大價值。
            </p>
            <p className="text-muted-foreground mb-4">
              自2020年成立以來，我們已經為超過100家企業提供服務，涵蓋金融、醫療、教育、零售等多個領域。
              我們的團隊由經驗豐富的工程師、數據科學家和產品專家組成。
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">100+</p>
                <p className="text-sm text-muted-foreground">合作客戶</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">50+</p>
                <p className="text-sm text-muted-foreground">團隊成員</p>
              </div>
            </div>
          </Card>
        </div>
      </SmartPageContainer>
    )
  }
};

export default function SmartDemoPage() {
  const [currentPage, setCurrentPage] = useState<keyof typeof pages>('dashboard');
  const [dynamicInstructions, setDynamicInstructions] = useState<string>('');
  
  // 處理 URL hash 和初始化頁面
  React.useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && pages[hash as keyof typeof pages]) {
      setCurrentPage(hash as keyof typeof pages);
    }
  }, []);

  // 保留向後兼容的 window 函數（給舊的導航工具使用）
  React.useEffect(() => {
    (window as any).navigateToPage = (pageId: keyof typeof pages) => {
      if (pages[pageId]) {
        setCurrentPage(pageId);
        window.history.replaceState(null, '', `#${pageId}`);
        return true;
      }
      return false;
    };
    
    (window as any).getAvailablePages = () => {
      return Object.keys(pages).map(key => ({
        id: key,
        title: pages[key as keyof typeof pages].title
      }));
    };

    // 設置全域函數供 ContextSelector 使用
    (window as any).setDynamicInstructions = (instructions: string) => {
      console.log("🎯 全域設置動態指令:", instructions);
      setDynamicInstructions(instructions);
    };
  }, []);

  const runtime = useChatRuntime({
    api: "/api/chat",
    // 將動態指令傳遞到 API
    body: dynamicInstructions ? { instructions: dynamicInstructions } : undefined,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {/* 註冊所有工具 */}
      <CalculatorToolUI />
      <WeatherConfirmUI />
      
      {/* 舊的導航工具（保留作為參考和向後兼容） */}
      <NavigationGuideUI />
      
      {/* 新的智能導航工具 */}
      <SmartPageNavigationTool />
      <SmartPageActionTool />
      
      <div className="h-screen">
        <AssistantSidebar>
          <div className="flex h-full">
            {/* 智能導航側邊欄 */}
            <SmartNavigation 
              currentPage={currentPage}
              pages={pages}
              setCurrentPage={setCurrentPage}
            />

            {/* 主要內容區域 */}
            {pages[currentPage].content}
          </div>
        </AssistantSidebar>
      </div>
    </AssistantRuntimeProvider>
  );
}