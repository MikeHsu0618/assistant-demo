"use client";

import React, { useState } from "react";
import { useAssistantInstructions, useAssistantRuntime } from "@assistant-ui/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ChevronDown, Code, Globe, Palette, Database, Settings, Search } from "lucide-react";

// 預設的上下文選項
const contextOptions = [
  {
    id: "javascript",
    label: "JavaScript",
    icon: Code,
    instruction: "請使用 JavaScript/TypeScript 語法和最佳實踐回答。專注於現代 ES6+ 語法、React、Node.js 相關內容。",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200"
  },
  {
    id: "python",
    label: "Python",
    icon: Code,
    instruction: "請使用 Python 語法和最佳實踐回答。專注於 Python 3.x、Django、FastAPI、數據科學相關內容。",
    color: "bg-blue-100 text-blue-800 border-blue-200"
  },
  {
    id: "react",
    label: "React/Next.js",
    icon: Code,
    instruction: "請專注於 React、Next.js、TypeScript 開發。使用函數式組件、Hooks、現代 React 模式回答。",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200"
  },
  {
    id: "database",
    label: "資料庫設計",
    icon: Database,
    instruction: "請專注於資料庫設計、SQL 查詢優化、資料結構設計。包含 PostgreSQL、MongoDB、Redis 等技術。",
    color: "bg-green-100 text-green-800 border-green-200"
  },
  {
    id: "ui-ux",
    label: "UI/UX 設計",
    icon: Palette,
    instruction: "請專注於用戶界面設計、用戶體驗、設計原則。包含 Tailwind CSS、設計系統、可訪問性等內容。",
    color: "bg-purple-100 text-purple-800 border-purple-200"
  },
  {
    id: "devops",
    label: "DevOps/部署",
    icon: Settings,
    instruction: "請專注於 DevOps、CI/CD、Docker、Kubernetes、雲端部署相相關內容。",
    color: "bg-orange-100 text-orange-800 border-orange-200"
  },
  {
    id: "general",
    label: "一般對話",
    icon: Globe,
    instruction: "請以友善、專業的方式回答一般性問題。保持對話自然流暢。",
    color: "bg-gray-100 text-gray-800 border-gray-200"
  }
];

interface ContextSelectorProps {
  className?: string;
}

export function ContextSelector({ className }: ContextSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 獲取 assistant runtime
  const runtime = useAssistantRuntime();
  
  // 生成動態指令
  const dynamicInstruction = React.useMemo(() => {
    if (selectedContexts.length === 0) return "";
    
    const instructions = selectedContexts
      .map(contextId => {
        const context = contextOptions.find(opt => opt.id === contextId);
        return context?.instruction;
      })
      .filter(Boolean)
      .join("\n\n");
    
    return `## 🎯 動態上下文指令\n\n${instructions}\n\n**請嚴格根據上述指令調整回答風格和內容重點。**`;
  }, [selectedContexts]);

  // 使用 assistant-ui 的動態指令 API
  useAssistantInstructions(dynamicInstruction);
  
  // 通過全域函數傳遞動態指令（專門給 demo 頁面使用）
  React.useEffect(() => {
    if (dynamicInstruction) {
      console.log("🎯 前端動態指令已設定:", dynamicInstruction);
      
      // 嘗試使用全域函數（如果存在的話，用於 demo 頁面）
      if (typeof window !== 'undefined' && (window as any).setDynamicInstructions) {
        console.log("🎯 使用全域函數設置動態指令");
        (window as any).setDynamicInstructions(dynamicInstruction);
      }
      
      // 嘗試直接修改 runtime（首頁可能會用到）
      if (runtime && 'system' in runtime) {
        (runtime as any).system = dynamicInstruction;
      }
      
      // 嘗試修改 options
      if (runtime && 'options' in runtime && runtime.options) {
        (runtime.options as any).instructions = dynamicInstruction;
      }
    }
  }, [dynamicInstruction, runtime]);

  const handleContextToggle = (contextId: string) => {
    setSelectedContexts(prev => {
      if (prev.includes(contextId)) {
        return prev.filter(id => id !== contextId);
      } else {
        return [...prev, contextId];
      }
    });
  };

  const handleRemoveContext = (contextId: string) => {
    setSelectedContexts(prev => prev.filter(id => id !== contextId));
  };

  // 搜尋過濾邏輯
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm.trim()) return contextOptions;
    
    const term = searchTerm.toLowerCase();
    return contextOptions.filter(option => 
      option.label.toLowerCase().includes(term) ||
      option.instruction.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const selectedOptions = contextOptions.filter(opt => selectedContexts.includes(opt.id));

  // 清空搜尋並關閉選單
  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  // 點擊外部關閉選單
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-context-selector]')) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} data-context-selector>
      {/* 主要的下拉按鈕 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Settings className="h-4 w-4" />
        上下文設定
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* 向上展開的選單 */}
      {isOpen && (
        <Card className="absolute bottom-full mb-2 left-0 z-50 w-80 shadow-lg max-h-96 flex flex-col">
          {/* 搜尋框區域 */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜尋上下文..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-8 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                autoFocus
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          
          {/* 可滾動的選項列表 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {filteredOptions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <div className="text-sm">找不到符合條件的上下文</div>
                <div className="text-xs mt-1">嘗試調整搜尋關鍵字</div>
              </div>
            ) : (
              filteredOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedContexts.includes(option.id);
                
                return (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleContextToggle(option.id)}
                  >
                    <div className={`p-1 rounded ${option.color}`}>
                      <Icon className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{option.label}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {option.instruction.slice(0, 40)}...
                      </div>
                    </div>
                    <div className={`w-3 h-3 border rounded-full flex-shrink-0 ${
                      isSelected 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-1 h-1 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}

      {/* 選中的上下文標籤 */}
      {selectedOptions.length > 0 && (
        <div className="space-y-2 mt-3">
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div
                  key={option.id}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${option.color}`}
                >
                  <Icon className="h-3 w-3" />
                  {option.label}
                  <button
                    onClick={() => handleRemoveContext(option.id)}
                    className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
          
          {/* 調試信息：顯示當前動態指令 */}
          {dynamicInstruction && (
            <details className="text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                🔍 查看當前動態指令 (調試用)
              </summary>
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 whitespace-pre-wrap max-h-32 overflow-y-auto">
                {dynamicInstruction}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

// 智能上下文組件 - 可以放在對話框的角落
export function ContextIndicator() {
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  
  // 監聽上下文變化（這裡可以通過 context 或 props 來獲取）
  const selectedOptions = contextOptions.filter(opt => selectedContexts.includes(opt.id));
  
  if (selectedOptions.length === 0) return null;
  
  return (
    <div className="fixed bottom-20 right-4 z-40">
      <Card className="p-2 shadow-lg bg-white/95 backdrop-blur">
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${option.color}`}
              >
                <Icon className="h-3 w-3" />
                {option.label}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
} 