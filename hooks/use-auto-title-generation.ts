import { useEffect, useRef, useState } from "react";
import { useThreadRuntime } from "@assistant-ui/react";

interface GeneratedTitle {
  title: string;
}

/**
 * 自動標題生成 Hook
 * 
 * 實現原理：
 * 1. 監聽對話更新，當有足夠內容時自動生成標題
 * 2. 使用防抖機制避免重複請求
 * 3. 提供手動刷新功能
 * 4. 使用本地狀態管理標題顯示
 */
export function useAutoTitleGeneration() {
  const threadRuntime = useThreadRuntime();
  const [generatedTitle, setGeneratedTitle] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const hasGeneratedRef = useRef(false);

  const generateTitle = async (force = false) => {
    if (!threadRuntime) return;
    
    const state = threadRuntime.getState();
    const messages = state.messages;
    
    // 檢查是否需要生成標題
    if (!force && (
      hasGeneratedRef.current ||
      state.isRunning ||
      messages.length < 2
    )) {
      return;
    }

    try {
      setIsGenerating(true);
      hasGeneratedRef.current = true;

      const response = await fetch('/api/chat/generate-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GeneratedTitle = await response.json();
      setGeneratedTitle(data.title);
      
    } catch (error) {
      console.error('標題生成失敗:', error);
      setGeneratedTitle('新對話');
    } finally {
      setIsGenerating(false);
    }
  };

  // 監聽對話狀態變化
  useEffect(() => {
    if (!threadRuntime) return;

    const unsubscribe = threadRuntime.subscribe(() => {
      const state = threadRuntime.getState();
      
      // 當對話完成時生成標題
      if (!state.isRunning && 
          state.messages.length >= 2 &&
          !hasGeneratedRef.current) {
        
        // 延遲生成，確保對話完成
        setTimeout(() => {
          generateTitle();
        }, 2000);
      }
    });

    return unsubscribe;
  }, [threadRuntime]);

  // 手動刷新標題
  const refreshTitle = () => {
    hasGeneratedRef.current = false;
    generateTitle(true);
  };

  return {
    generatedTitle,
    isGenerating,
    refreshTitle,
  };
}