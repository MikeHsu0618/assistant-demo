# 程式碼風格與約定

## TypeScript 設定
- **嚴格模式**: 啟用所有 TypeScript 嚴格檢查
- **模組解析**: bundler 模式
- **路徑映射**: `@/*` 指向專案根目錄

## React 約定
- **函數式元件**: 統一使用 FC (FunctionComponent) 類型
- **Client 元件**: 需要互動的元件使用 "use client" 指令
- **Props 類型**: 使用 React.ComponentProps 和 VariantProps

## 樣式約定
- **Tailwind CSS**: 使用原子化 CSS 類別
- **CVA**: 使用 class-variance-authority 管理元件變體
- **cn 函數**: 使用 clsx + tailwind-merge 進行類別合併
- **CSS 變數**: 使用 CSS 自定義屬性 (如 --thread-max-width)

## 檔案命名
- **元件檔案**: kebab-case.tsx (如 tool-fallback.tsx)
- **工具檔案**: kebab-case.ts (如 use-mobile.ts)
- **配置檔案**: 遵循工具約定 (如 eslint.config.mjs)

## Import 順序
1. React 相關 import
2. 第三方套件
3. 專案內部元件 (@/components)
4. 工具函數 (@/lib)
5. 類型定義