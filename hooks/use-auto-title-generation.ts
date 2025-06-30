import { useEffect, useRef, useState } from "react";
import { useThreadListItemRuntime, useThreadRuntime } from "@assistant-ui/react";

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
  const threadListItemRuntime = useThreadListItemRuntime();
  const threadRuntime = useThreadRuntime();
  
  // 防重複機制
  const hasAttemptedGeneration = useRef(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isRequestInProgress = useRef(false);
  
  // 狀態管理
  const [generatedTitle, setGeneratedTitle] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // 核心標題生成邏輯
  const performTitleGeneration = async () => {
    if (isRequestInProgress.current || isGenerating) return;
    
    try {
      isRequestInProgress.current = true;
      setIsGenerating(true);
      
      const messages = threadRuntime.getState().messages;
      if (messages.length < 2) return;
      
      // 轉換消息格式
      const formattedMessages = messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content.map((part: any) => 
          part.type === 'text' ? { type: 'text', text: part.text } : part
        )
      }));

      const response = await fetch("/api/chat/generate-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: formattedMessages }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      
      if (result.title && result.title !== '新對話') {
        setGeneratedTitle(result.title);
        hasAttemptedGeneration.current = true;
      }
    } catch (error) {
      console.error('標題生成失敗:', error);
    } finally {
      setIsGenerating(false);
      isRequestInProgress.current = false;
    }
  };

  // 檢查是否應該生成標題
  const shouldGenerateTitle = () => {
    if (hasAttemptedGeneration.current) return false;
    
    try {
      const state = threadListItemRuntime.getState();
      const messages = threadRuntime.getState().messages;
      
      return (
        state?.status === 'regular' &&
        messages.length >= 2 &&
        (!state.title || state.title === 'New Chat' || state.title === '新對話')
      );
    } catch {
      return false;
    }
  };

  // 自動生成標題
  useEffect(() => {
    if (hasAttemptedGeneration.current) return;
    
    const handleUpdate = () => {
      // 防抖：清除之前的定時器
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      // 延遲檢查，確保對話完成
      debounceTimeoutRef.current = setTimeout(() => {
        if (shouldGenerateTitle()) {
          performTitleGeneration();
        }
      }, 2000);
    };

    // 只訂閱 thread runtime 變化（避免重複訂閱）
    const unsubscribe = threadRuntime.subscribe(handleUpdate);
    
    return () => {
      unsubscribe();
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [threadListItemRuntime, threadRuntime]);

  // 手動生成標題
  const generateTitle = async () => {
    // 重置狀態以允許重新生成
    hasAttemptedGeneration.current = false;
    setGeneratedTitle(null);
    await performTitleGeneration();
  };

  return {
    generateTitle,
    hasGenerated: hasAttemptedGeneration.current,
    generatedTitle,
    isGenerating
  };
}