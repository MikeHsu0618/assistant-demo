# 專案結構

## 目錄架構
```
assistant-demo/
├── app/                      # Next.js App Router
│   ├── api/chat/            # API 端點
│   │   └── route.ts         # 聊天 API 路由
│   ├── assistant.tsx        # 主要助手元件
│   ├── layout.tsx          # 根佈局
│   └── page.tsx            # 首頁
├── components/              # UI 元件
│   ├── ui/                 # 基礎 UI 元件 (shadcn/ui 風格)
│   │   ├── button.tsx      # 按鈕元件
│   │   ├── input.tsx       # 輸入元件
│   │   ├── sidebar.tsx     # 側邊欄元件
│   │   └── ...
│   ├── assistant-ui/       # Assistant-UI 相關元件
│   │   ├── thread.tsx      # 對話線程
│   │   ├── markdown-text.tsx # Markdown 渲染
│   │   ├── tool-fallback.tsx # 工具回退 UI
│   │   └── ...
│   └── app-sidebar.tsx     # 應用側邊欄
├── hooks/                  # React Hooks
│   └── use-mobile.ts       # 手機檢測
├── lib/                    # 工具函數
│   └── utils.ts           # 通用工具
└── 配置檔案...
```

## 關鍵元件說明
- **Assistant**: 主要容器元件，整合 RuntimeProvider 和 Sidebar
- **Thread**: 對話介面核心元件
- **ToolFallback**: 工具執行預設 UI
- **MarkdownText**: Markdown 渲染元件