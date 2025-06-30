# 建議命令

## 開發命令
```bash
# 啟動開發伺服器 (使用 Turbopack)
npm run dev

# 建置專案
npm run build

# 啟動生產環境
npm run start

# 程式碼檢查
npm run lint
```

## 環境設定
```bash
# 建立環境變數檔案
cp .env.example .env.local

# 設定 OpenAI API Key
echo "OPENAI_API_KEY=sk-your-key-here" >> .env.local
```

## 系統工具 (Darwin)
```bash
# 檔案操作
ls -la          # 詳細列表
find . -name    # 搜尋檔案
grep -r         # 遞歸搜尋

# Git 操作
git status      # 查看狀態
git add .       # 暫存所有變更
git commit -m   # 提交變更

# 套件管理
npm install     # 安裝依賴
npm update      # 更新套件
```

## 開發工具
```bash
# 檢查依賴
npm outdated

# 清理快取
npm cache clean --force
rm -rf .next node_modules
npm install
```