# 项目设计

该项目是一个pnpm管理的monorepo项目

主要分为server 和 web 两端
用于验证需要前后端配合的场景
比如数据流式传输sse等

```bash
root/
├── apps/
│   ├── server/                  # 服务端
│   │   ├── src/
│   │   │   ├── routes/          # 路由定义
│   │   │   ├── middleware/      # 中间件
│   │   │   ├── services/        # 业务逻辑
│   │   │   └── index.ts         # 入口
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── web/                     # 客户端
│   │   ├── src/
│   │   │   ├── pages/           # 页面
│   │   │   ├── components/      # 客户端专属组件
│   │   │   ├── hooks/           # 自定义 Hooks
│   │   │   ├── stores/          # stores
│   │   │   └── lib/             # 工具函数
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
├── packages/
│   ├── shared/                  # 共享类型、Schema、常量、工具
│   │   ├── src/
│   │   │   ├── schemas/         # Schema
│   │   │   ├── types/           # TypeScript 类型
│   │   │   ├── constants/       # 业务常量与枚举
│   │   │   ├── utils/           # 工具函数
│   │   │   └── index.ts         # 统一导出
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── config/                  # 共享配置
│       ├── tsconfig.base.json   # TypeScript 基础配置
│       ├── tsconfig.web.json    # 前端vue项目ts配置
│       ├── tsconfig.node.json   # 后台Node项目ts配置
│       └── eslint.config.mjs    # lint/format 配置
│
├── turbo.json                   # Turborepo 任务配置
├── package.json                 # 根 package.json
└── pnpm-lock.yaml
```

设计web、server模拟streaming 流式读取

## 架构设计

### 核心原则：按场景分组

每个场景（SSE、WebSocket 等）是一个独立单元，server 和 web 各自按场景组织子目录。场景间完全隔离，新增场景不影响已有场景。

### 场景扩展模式

每新增一个场景，只需：

1. `apps/server/src/routes/<scene>/` — 添加场景路由目录，以 `index.ts` 作为 Hono 子路由，挂载到顶层 `routes/index.ts`
2. `apps/web/src/pages/<scene>/` — 添加场景页面目录
3. `packages/shared/src/` — 添加该场景的类型/常量（如需要）
4. 在 server 顶层 `routes/index.ts` 注册，在 web 首页加导航入口

### 技术选型

- **server**: Hono + @hono/node-server（轻量、TypeScript 原生、SSE 支持好）
- **web**: Vue 3 + Vite + Vue Router
- **shared**: 跨端类型和常量，统一从 `@playground/shared` 导入

## 开发

```bash
pnpm install        # 安装所有依赖
pnpm dev            # 启动所有 app
```

server: `http://localhost:3000`
web: `http://localhost:5173`