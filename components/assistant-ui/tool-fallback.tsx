import { ToolCallContentPartComponent } from "@assistant-ui/react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, Settings, Clock, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export const ToolFallback: ToolCallContentPartComponent = ({
  toolName,
  argsText,
  result,
  status,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  // 獲取工具狀態樣式
  const getStatusStyles = () => {
    switch (status?.type) {
      case "running":
        return {
          icon: <Clock className="size-4 animate-spin text-blue-600" />,
          bgColor: "bg-blue-50 border-blue-200",
          textColor: "text-blue-900",
          statusText: "執行中..."
        };
      case "complete":
        return {
          icon: <CheckIcon className="size-4 text-emerald-600" />,
          bgColor: "bg-emerald-50 border-emerald-200", 
          textColor: "text-emerald-900",
          statusText: "已完成"
        };
      case "incomplete":
        return {
          icon: <Zap className="size-4 text-orange-600" />,
          bgColor: "bg-orange-50 border-orange-200",
          textColor: "text-orange-900", 
          statusText: "處理中..."
        };
      default:
        return {
          icon: <Settings className="size-4 text-gray-600" />,
          bgColor: "bg-gray-50 border-gray-200",
          textColor: "text-gray-900",
          statusText: "準備中"
        };
    }
  };

  const statusStyles = getStatusStyles();

  return (
    <div className={cn(
      "mb-4 flex w-full flex-col gap-3 rounded-xl border shadow-sm transition-all duration-200",
      statusStyles.bgColor
    )}>
      {/* 工具標題欄 */}
      <div className="flex items-center gap-3 px-4 py-3">
        {statusStyles.icon}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn("font-medium", statusStyles.textColor)}>
              {toolName}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-white/50 text-gray-600">
              {statusStyles.statusText}
            </span>
          </div>
          {!isCollapsed && (
            <p className="text-sm text-gray-600 mt-1">
              工具調度系統 · 通用處理介面
            </p>
          )}
        </div>
        <Button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-white/50"
        >
          {isCollapsed ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronUpIcon className="h-4 w-4" />}
        </Button>
      </div>

      {/* 詳細資訊展開區域 */}
      {!isCollapsed && (
        <div className="border-t border-white/50 bg-white/30">
          {/* 輸入參數 */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-gray-700">輸入參數</span>
            </div>
            <div className="bg-white/60 rounded-lg p-3 border">
              <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
                {argsText}
              </pre>
            </div>
          </div>

          {/* 執行結果 */}
          {result !== undefined && (
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium text-gray-700">執行結果</span>
              </div>
              <div className="bg-white/60 rounded-lg p-3 border max-h-64 overflow-y-auto">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
                  {typeof result === "string"
                    ? result
                    : JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* 工具資訊 */}
          <div className="px-4 pb-3 border-t border-white/50 pt-3">
            <div className="flex justify-between text-xs text-gray-600">
              <span>工具類型：通用處理器</span>
              <span>狀態：{statusStyles.statusText}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
