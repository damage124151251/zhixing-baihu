# 🐯 执行白虎 ZHÍXÍNG BÁIHǓ

> 观察。等待。执行。
> Observar. Esperar. Executar.

AI交易机器人 - BSC模拟交易 | AI Trading Bot - BSC Simulation Trading

## 🌐 链接 Links

- **网站 Site:** [部署后更新]
- **推特 Twitter:** [配置后更新]
- **代币CA Token CA:** [如有]

## 📦 项目结构 Structure

```
zhixing-baihu/
├── bot/              # 交易机器人 Trading Bot
│   ├── src/
│   │   ├── index.js  # 主入口 Entry Point
│   │   ├── config.js # 配置 Configuration
│   │   └── lib/      # 模块 Modules
│   ├── scripts/      # 脚本 Scripts
│   └── logs/         # 日志 Logs
├── site/             # Next.js 网站 Dashboard
│   ├── app/          # 页面 Pages
│   ├── components/   # 组件 Components
│   └── lib/          # 工具 Utilities
├── supabase/         # 数据库脚本 Database Scripts
└── logs/             # 会话日志 Session Logs
```

## ⚙️ 安装 Setup

### 前提条件 Prerequisites
- Node.js 18+
- [Supabase](https://supabase.com) 账户

### 1. 克隆仓库 Clone Repository
```bash
git clone https://github.com/[用户名]/zhixing-baihu.git
cd zhixing-baihu
```

### 2. 配置机器人 Configure Bot
```bash
cd bot
cp .env.example .env
# 编辑 .env 填写凭据
npm install
```

### 3. 配置Supabase Database
1. 在 [supabase.com](https://supabase.com) 创建项目
2. 进入 SQL Editor
3. 执行 `supabase/schema.sql`
4. 执行 `supabase/fix_realtime.sql`

### 4. 测试连接 Test Connections
```bash
node scripts/test-connections.js
```

### 5. 启动机器人 Start Bot
```bash
npm start
```

### 6. 配置网站 Configure Site (可选)
```bash
cd ../site
cp .env.example .env.local
# 编辑 .env.local
npm install
npm run dev
```

## 🔧 环境变量 Environment Variables

### Bot (.env)
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
BSC_RPC=https://bsc-dataseed1.binance.org
CLAUDE_API_KEY=        # 可选 Optional
WALLET_PRIVATE_KEY=    # 真实交易用 For real trading
```

### Site (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## 🎭 虎态系统 Tiger States

| 状态 State | 精神值 Sanity | 描述 Description |
|------------|---------------|------------------|
| 🔥 猎杀 LIESHA | 80-100% | 攻击模式 Attack Mode |
| 😎 潜伏 QIANFU | 60-79% | 埋伏等待 Ambush Mode |
| 🤔 观察 GUANCHA | 40-59% | 谨慎分析 Cautious Mode |
| 😤 警觉 JINGJUE | 20-39% | 防御模式 Defensive Mode |
| 💀 受伤 SHOUSHANG | 0-19% | 恢复模式 Recovery Mode |

## 📊 交易参数 Trading Parameters

```
初始余额: 10 BNB (模拟)
最低分数: 75/100
单笔最大: 0.5 BNB
止损: -20%
止盈: +40%
滑点: 12%
```

## 🛠️ 常用命令 Useful Commands

```bash
# 自动设置 Auto Setup
cd bot && node scripts/setup.js

# 测试连接 Test Connections
node scripts/test-connections.js

# 运行机器人 Run Bot
npm start

# 构建网站 Build Site
cd site && npm run build
```

## ⚠️ 免责声明 Disclaimer

这是一个实验性项目。加密货币交易涉及重大风险。
本机器人目前运行在**模拟模式**，不涉及真实资金。

This is an experimental project. Cryptocurrency trading involves significant risk.
This bot currently operates in **SIMULATION MODE** with no real funds.

**非投资建议 | Not Financial Advice**

## 📄 许可证 License

MIT

---

**"一千次虚拟猎杀造就完美真实猎杀"**
**"Mil caças virtuais fazem uma caça real perfeita"**

🐯 执行白虎
