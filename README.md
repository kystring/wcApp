# 语文闯关 — 中职语文分层学习小程序

面向中职学生的语文闯关学习微信小程序，基于 UniApp (Vue 3) 构建。包含分层闯关、古诗文默写/阅读、应用文/常规文体写作、错题本、荣誉榜等完整学习闭环。当前使用 Mock 数据模拟全部后端交互。

## 技术栈

| 项目 | 说明 |
|------|------|
| 框架 | UniApp 3.x (Vue 3) |
| 语言 | JavaScript (Composition API + `<script setup>`) |
| 状态管理 | Pinia |
| 样式 | SCSS |
| 构建 | Vite 5 |
| 目标平台 | 微信小程序 |
| 数据 | Mock 模拟（题库 200+、OCR 模拟、AI 对话树、排行榜） |

## 功能模块

### 学习路径（首页）
- 知识热力图：按考点展示掌握程度
- AI 教练消息：根据学习状态推送鼓励/提醒
- 同伴锚点：好友段位对比
- 快捷入口：直达闯关、默写、写作

### 分层闯关
- 6 段位制（青铜→白银→黄金→铂金→钻石→王者）
- 3+2 渐进式组卷算法
- 错题优先（50% 旧错题 + 50% 新题）
- 标签轮换确保考点覆盖均匀
- PK 对战（AI 对手 15s 兜底）

### 古诗文默写
- OCR 拍照识别（Mock 模拟，随机引入错字）
- 分步揭示纠错流程
- 常见错别字库匹配

### 古诗文阅读
- 5 种情感分类诗词（爱国/思乡/送别/边塞/山水）
- 主观题 AI 判方向（正确/沾边/再想想）
- 文言文实词 + 采分点可视化

### 写作训练
- 应用文：6 种文体格式引导 + 格式检测
- 常规文体：AI 对话审题 → 三档框架填充 → 聚焦反馈
- 字数/格式自动检测

### 个人中心
- 荣誉榜（日榜 + 周榜）
- 错题本（按考点分组，清空兑换免做卡）
- 段位保护卡（每周领取）
- 登录/注册（学号+密码）

## 目录结构

```
demoApp/
├── index.html                  # 入口 HTML
├── package.json                # 依赖配置
├── vite.config.js              # Vite 构建配置
├── .gitignore
├── src/
│   ├── main.js                 # 应用入口（Pinia + 全局导航拦截）
│   ├── App.vue                 # 根组件（启动恢复登录态）
│   ├── pages.json              # 路由 + TabBar 配置
│   ├── uni.scss                # 全局 SCSS 变量
│   ├── manifest.json           # 小程序配置
│   │
│   ├── pages/                  # 页面（21 个）
│   │   ├── login/              # 登录 / 注册
│   │   ├── index/              # 首页（学习路径）
│   │   ├── challenge/          # 闯关（dashboard / quiz / result / pk）
│   │   ├── poetry/             # 古诗文（默写 / 阅读）
│   │   ├── writing/            # 写作（应用文 / 常规文体）
│   │   └── profile/            # 我的（荣誉榜 / 错题本）
│   │
│   ├── components/             # 组件（14 个）
│   │   ├── common/             # 通用组件（EmptyState / LoadingOverlay / ConfirmModal 等）
│   │   ├── tier/               # 闯关组件（QuestionCard / TierBadge 等）
│   │   ├── learning-path/      # 学习路径组件（Heatmap / CoachMessage / PeerAnchor）
│   │   └── poetry/             # 古诗文组件（EmotionCard / StepRevealArea）
│   │
│   ├── stores/                 # Pinia Store（6 个）
│   │   ├── user.js             # 用户 + 登录认证
│   │   ├── tier.js             # 答题引擎
│   │   ├── poetry.js           # 古诗文
│   │   ├── writing.js          # 写作
│   │   ├── learning-path.js    # 学习路径
│   │   └── honor.js            # 荣誉体系
│   │
│   ├── mock/                   # Mock 数据（10 个文件）
│   │   ├── students.js         # 学生账号
│   │   ├── questions.js        # 题库（200+题，10 考点）
│   │   ├── poetry-data.js      # 诗词数据
│   │   ├── dictation-data.js   # 默写题
│   │   ├── ocr-simulator.js    # OCR 模拟器
│   │   ├── ai-dialogue.js      # AI 对话树
│   │   ├── pk-opponents.js     # PK 对手
│   │   ├── honor-data.js       # 排行榜
│   │   ├── peer-data.js        # 同伴数据
│   │   └── index.js            # 工具函数
│   │
│   ├── utils/                  # 工具函数
│   │   ├── constants.js        # 常量（段位 / 考点 / 情感分类等）
│   │   ├── exam-points.js      # 考点标签
│   │   ├── question-picker.js  # 3+2 选题算法
│   │   └── scoring.js          # 积分规则
│   │
│   └── composables/            # 组合函数
│       └── useAuthGuard.js     # 路由守卫
```

## 快速开始

### 环境要求
- Node.js 18+
- 微信开发者工具（[下载](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)）

### 安装与运行

```bash
# 1. 安装依赖
npm install --legacy-peer-deps

# 2. 开发模式（自动监听文件变更）
npm run dev:mp-weixin

# 3. 生产构建
npm run build:mp-weixin
```

### 在微信开发者工具中预览

1. 打开**微信开发者工具**
2. 点击「导入项目」
3. 目录选择：
   - 开发模式：`dist/dev/mp-weixin`
   - 构建模式：`dist/build/mp-weixin`
4. AppID 选择「测试号」
5. 点击「确定」

### 测试账号

| 学号 | 密码 | 昵称 | 段位 |
|------|------|------|------|
| 2024001 | 123456 | 语文小将 | 青铜 |
| 2024002 | 123456 | 诗词达人 | 白银 |
| 2024003 | 123456 | 文学少年 | 黄金 |

也可在注册页自行创建新账号。

## 设计原则

- **能用规则不用 AI** — 组卷、格式检测、字数检查等用纯逻辑
- **全 Mock 模拟** — 题库、OCR、AI 对话、排行榜均由本地数据模拟，无需后端
- **渐进式难度** — 3+2 开荒期（纯基础→80/20→60/40），稳定期 50/50 错题优先
- **轻社交压力** — 同伴锚点只展示段位对比，无排名压迫感

## 截图

> 在微信开发者工具中运行后，可使用工具自带的截图功能截取各页面。主要页面包括：
>
> 登录页 → 首页（学习路径）→ 闯关 Dashboard → 答题页 → 结果页 →
> PK 匹配 → 古诗文默写 → 诗词阅读 → 应用文写作 → 常规文体写作 →
> 荣誉榜 → 错题本 → 个人中心

## License

MIT
