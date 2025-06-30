# 任務完成工作流程

## 程式碼修改後檢查清單

### 1. 程式碼品質檢查
```bash
# 執行 ESLint 檢查
npm run lint

# 如果有錯誤，修復它們
npm run lint -- --fix
```

### 2. 類型檢查
```bash
# TypeScript 編譯檢查
npx tsc --noEmit
```

### 3. 測試執行
```bash
# 本地開發測試
npm run dev

# 建置測試
npm run build
```

### 4. 功能驗證
- [ ] 頁面載入正常
- [ ] 對話功能運作
- [ ] 工具執行正常
- [ ] 響應式設計正確
- [ ] 無控制台錯誤

### 5. 提交前檢查
- [ ] 程式碼符合專案風格
- [ ] 無未使用的 import
- [ ] 類型定義完整
- [ ] 註解適當
- [ ] 無 console.log 殘留

## 最佳實踐
- 遵循 assistant-ui 官方最佳實踐
- 使用官方元件，避免自造輪子
- 保持元件的可重用性
- 確保 accessibility 支援