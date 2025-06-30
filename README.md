# Assistant Demo - 智能標題生成

基於 Next.js 15 + assistant-ui 的智能助手，具備自動標題生成功能。

## 🎯 核心功能

- **自動標題生成**: 使用 OpenAI 分析對話內容生成標題
- **智能工具系統**: 天氣查詢、計算器、導航、文本生成
- **現代化 UI**: 基於 Radix UI + Tailwind CSS

## 🏗️ 技術實現

### 標題生成系統
- **API 端點**: `/api/chat/generate-title` - 使用 gpt-4o-mini 生成標題
- **自動觸發**: 對話開始後 2 秒自動生成
- **手動刷新**: 支持點擊按鈕重新生成標題
- **本地狀態管理**: 避免複雜的狀態同步問題

## 🚀 快速開始

```bash
# 安裝依賴
npm install

# 設置環境變數（添加你的 OPENAI_API_KEY）
cp .env.example .env.local

# 啟動開發服務器
npm run dev
```

## 📁 核心文件

- `app/api/chat/generate-title/route.ts` - 標題生成 API
- `hooks/use-auto-title-generation.ts` - 自動標題生成 Hook
- `components/assistant-ui/smart-thread-list-item.tsx` - 智能線程組件

## 🎯 使用方式

1. 開始新對話
2. 發送幾條消息
3. 標題會在 2 秒後自動生成
4. 點擊刷新按鈕可重新生成標題

### 常見問題

- **標題不更新**: 檢查 OpenAI API Key 配置
- **生成失敗**: 查看瀏覽器控制台錯誤
- **手動刷新**: 點擊線程項目旁的刷新按鈕

## 📄 License

MIT
