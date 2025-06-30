"use client";

import { makeAssistantToolUI } from "@assistant-ui/react";
import { useState } from "react";
import { 
  Home, 
  MessageCircle, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw,
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Navigation,
  ExternalLink,
  Layout,
  BarChart3,
  User,
  Settings,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 導覽工具的輸入參數類型
type NavigationArgs = {
  target: "homepage" | "chat" | "top" | "bottom" | "refresh" | "demo" | "dashboard" | "profile" | "settings" | "about";
  reason: string;
};

// 導覽結果類型
type NavigationResult = {
  target: string;
  action: string;
  success: boolean;
  message: string;
  error?: string;
  timestamp: string;
};

// 導覽目標映射
const navigationTargets = {
  homepage: { 
    label: "首頁", 
    icon: Home, 
    description: "回到應用主頁面",
    action: "navigate_home"
  },
  chat: { 
    label: "聊天頁面", 
    icon: MessageCircle, 
    description: "前往聊天對話區域",
    action: "scroll_to_chat"  
  },
  top: { 
    label: "頁面頂部", 
    icon: ArrowUp, 
    description: "滾動到當前頁面最上方",
    action: "scroll_to_top"
  },
  bottom: { 
    label: "頁面底部", 
    icon: ArrowDown, 
    description: "滾動到當前頁面最下方",
    action: "scroll_to_bottom"
  },
  refresh: { 
    label: "刷新頁面", 
    icon: RefreshCw, 
    description: "重新載入當前頁面",
    action: "refresh_page"
  },
  demo: { 
    label: "Demo 頁面", 
    icon: Layout, 
    description: "前往 AssistantSidebar 展示頁面",
    action: "navigate_demo"
  },
  dashboard: { 
    label: "儀表板", 
    icon: BarChart3, 
    description: "前往儀表板頁面",
    action: "navigate_dashboard"
  },
  profile: { 
    label: "個人資料", 
    icon: User, 
    description: "前往個人資料頁面",
    action: "navigate_profile"
  },
  settings: { 
    label: "設定", 
    icon: Settings, 
    description: "前往系統設定頁面",
    action: "navigate_settings"
  },
  about: { 
    label: "關於我們", 
    icon: Info, 
    description: "前往關於我們頁面",
    action: "navigate_about"
  },
};

// 執行導覽操作
async function executeNavigation(args: NavigationArgs): Promise<NavigationResult> {
  const startTime = Date.now();
  const target = navigationTargets[args.target];
  
  // 安全檢查：如果找不到對應的目標配置
  if (!target) {
    return {
      target: args.target,
      action: "error",
      success: false,
      message: "導覽失敗",
      error: `不支援的導覽目標：${args.target}`,
      timestamp: new Date().toISOString(),
    };
  }
  
  try {
    // 模擬執行延遲
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let success = false;
    let message = "";
    
    switch (args.target) {
      case "homepage":
        // 導航到首頁
        window.location.href = "/";
        success = true;
        message = `已導航到${target.label}`;
        break;
        
      case "chat":
        // 滾動到聊天區域或頁面頂部
        window.scrollTo({ top: 0, behavior: 'smooth' });
        success = true;
        message = `已前往${target.label}`;
        break;
        
      case "top":
        // 滾動到頂部
        window.scrollTo({ top: 0, behavior: 'smooth' });
        success = true;
        message = `已滾動到${target.label}`;
        break;
        
      case "bottom":
        // 滾動到底部
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        success = true;
        message = `已滾動到${target.label}`;
        break;
        
      case "refresh":
        // 刷新頁面
        window.location.reload();
        success = true;
        message = `正在${target.label}...`;
        break;
        
      case "demo":
        // 導航到 demo 頁面
        window.location.href = "/demo";
        success = true;
        message = `已導航到${target.label}`;
        break;
        
      case "dashboard":
        // 檢查是否在 demo 頁面，如果是則直接導覽
        if (window.location.pathname === "/demo" && (window as any).navigateToPage) {
          (window as any).navigateToPage("dashboard");
          success = true;
          message = `已導覽到${target.label}`;
        } else {
          // 否則先導航到 demo 頁面再跳轉到儀表板
          window.location.href = "/demo#dashboard";
          success = true;
          message = `已導航到${target.label}`;
        }
        break;
        
      case "profile":
        // 檢查是否在 demo 頁面，如果是則直接導覽
        if (window.location.pathname === "/demo" && (window as any).navigateToPage) {
          (window as any).navigateToPage("profile");
          success = true;
          message = `已導覽到${target.label}`;
        } else {
          // 否則先導航到 demo 頁面再跳轉到個人資料
          window.location.href = "/demo#profile";
          success = true;
          message = `已導航到${target.label}`;
        }
        break;
        
      case "settings":
        // 檢查是否在 demo 頁面，如果是則直接導覽
        if (window.location.pathname === "/demo" && (window as any).navigateToPage) {
          (window as any).navigateToPage("settings");
          success = true;
          message = `已導覽到${target.label}`;
        } else {
          // 否則先導航到 demo 頁面再跳轉到設定
          window.location.href = "/demo#settings";
          success = true;
          message = `已導航到${target.label}`;
        }
        break;
        
      case "about":
        // 檢查是否在 demo 頁面，如果是則直接導覽
        if (window.location.pathname === "/demo" && (window as any).navigateToPage) {
          (window as any).navigateToPage("about");
          success = true;
          message = `已導覽到${target.label}`;
        } else {
          // 否則先導航到 demo 頁面再跳轉到關於我們
          window.location.href = "/demo#about";
          success = true;
          message = `已導航到${target.label}`;
        }
        break;
        
      default:
        throw new Error(`不支援的導覽目標：${args.target}`);
    }
    
    return {
      target: target.label,
      action: target.action,
      success,
      message,
      timestamp: new Date().toISOString(),
    };
    
  } catch (error) {
    return {
      target: target?.label || args.target,
      action: target?.action || "error",
      success: false,
      message: "導覽失敗",
      error: error instanceof Error ? error.message : "未知錯誤", 
      timestamp: new Date().toISOString(),
    };
  }
}

// 導覽確認組件
const NavigationConfirmComponent = ({ args, result, addResult }: {
  args: NavigationArgs,
  result?: NavigationResult,
  addResult: (result: NavigationResult) => void
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const target = navigationTargets[args.target];
  
  // 安全檢查：如果找不到對應的目標配置
  if (!target) {
    return (
      <Card className="border-red-200 bg-red-50 max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-800 text-base">配置錯誤</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-red-700 text-sm">
            不支援的導覽目標：{args.target}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const TargetIcon = target.icon;

  // 如果已經有結果，顯示導覽結果
  if (result) {
    if (result.error) {
      return (
        <Card className="border-red-200 bg-red-50 max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-800 text-base">導覽失敗</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 text-sm">{result.error}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-green-200 bg-green-50 max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800 text-base">
              導覽完成 ✅
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <TargetIcon className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-green-900">{result.target}</p>
              <p className="text-sm text-green-700">{result.message}</p>
            </div>
          </div>
          
          <div className="text-xs text-green-600 border-t pt-2">
            執行時間：{new Date(result.timestamp).toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>
    );
  }

  // 顯示確認界面
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const navigationResult = await executeNavigation(args);
      addResult(navigationResult);
    } catch {
      addResult({
        target: target?.label || args.target,
        action: target?.action || "error",  
        success: false,
        message: "導覽失敗",
        error: "執行導覽時發生錯誤",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = () => {
    addResult({
      target: target?.label || args.target,
      action: target?.action || "error",
      success: false,
      message: "用戶取消了導覽操作",
      error: "用戶取消了導覽操作",
      timestamp: new Date().toISOString(),
    });
  };

  if (isLoading) {
    return (
      <Card className="border-blue-200 bg-blue-50 max-w-md">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-blue-700">正在導覽至 {target?.label || args.target}...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50 max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <CardTitle className="text-orange-800 text-base">導覽確認</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <TargetIcon className="h-5 w-5 text-orange-600" />
            <div>
              <p className="font-medium text-orange-900">{target.label}</p>
              <p className="text-sm text-orange-700">{target.description}</p>
            </div>
          </div>
          
          <div className="bg-white/50 rounded-lg p-3 border border-orange-200">
            <p className="text-sm text-gray-700">
              <strong>用戶請求：</strong>{args.reason}
            </p>
          </div>
          
          <div className="text-xs text-gray-600">
            <Navigation className="inline h-3 w-3 mr-1" />
            智能導覽系統將執行相應的頁面操作
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            確認導覽
          </Button>
          <Button
            onClick={handleReject}
            disabled={isLoading}
            variant="destructive"
            className="flex-1"
            size="sm" 
          >
            ✗ 取消
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const NavigationGuideUI = makeAssistantToolUI<NavigationArgs, NavigationResult>({
  toolName: "navigationGuide",
  render: NavigationConfirmComponent,
}); 