# 项目结构设计

**日期：** 2026-05-07  
**项目：** playground — 前后端场景试验场

---

## 背景

这是一个 pnpm + Turborepo 管理的 monorepo，目的是作为需要前后端配合的场景的试验场。SSE（Server-Sent Events）是第一个验证场景，后续会持续扩展其他场景（如 WebSocket、long-polling 等）。

## 技术栈

- **server**：Node.js / TypeScript，使用 **Hono** 框架
- **web**：Vue 3 + TypeScript，使用 Vite 构建
- **shared**：跨端共享的类型、Schema、常量、工具函数
- **config**：共享 TypeScript 配置和 ESLint 配置

## 架构设计

### 核心原则：按场景分组

每个场景（SSE、WebSocket 等）是一个独立单元，server 和 web 各自按场景组织子目录。场景间完全隔离，新增场景不影响已有场景。

### 场景扩展模式

每新增一个场景，只需：

1. `apps/server/src/routes/<scene>/` — 添加路由
2. `apps/web/src/pages/<scene>/` — 添加页面
3. `packages/shared/src/` — 添加该场景的类型/常量（如需要）
4. 在 server `routes/index.ts` 注册路由，在 web 首页加导航入口

## 目录结构

```
root/
├── apps/
│   ├── server/
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── sse/                 # SSE 场景路由
│   │   │   │   │   ├── index.ts         # 路由注册
│   │   │   │   │   ├── demo.ts          # 基础 SSE demo
│   │   │   │   │   ├── llm.ts           # 模拟 LLM 流式回复
│   │   │   │   │   ├── realtime.ts      # 实时数据推送
│   │   │   │   │   └── chunked.ts       # 分块传输
│   │   │   │   └── index.ts             # 路由总注册入口
│   │   │   ├── middleware/              # 全局中间件（cors、logger 等）
│   │   │   ├── services/               # 可复用业务逻辑
│   │   │   └── index.ts                # Hono app 入口
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── web/
│       ├── src/
│       │   ├── pages/
│       │   │   ├── home/                # 首页：场景导航列表
│       │   │   │   └── index.vue
│       │   │   └── sse/                 # SSE 场景页面
│       │   │       ├── index.vue        # SSE 场景入口/导航
│       │   │       ├── Demo.vue         # 基础 demo
│       │   │       ├── Llm.vue          # 模拟 LLM
│       │   │       ├── Realtime.vue     # 实时数据
│       │   │       └── Chunked.vue      # 分块传输
│       │   ├── components/              # 跨场景公共组件
│       │   ├── hooks/                   # 自定义 composables
│       │   ├── stores/                  # Pinia stores
│       │   ├── lib/                     # 工具函数
│       │   └── router/                  # Vue Router 配置
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── shared/
│   │   ├── src/
│   │   │   ├── schemas/                 # Zod schema（请求/响应校验）
│   │   │   ├── types/                   # TypeScript 类型
│   │   │   │   └── sse.ts               # SSE 相关类型
│   │   │   ├── constants/               # 常量与枚举
│   │   │   │   └── sse.ts               # SSE 相关常量（事件名等）
│   │   │   ├── utils/                   # 工具函数
│   │   │   └── index.ts                 # 统一导出
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── config/
│       ├── tsconfig.base.json
│       ├── tsconfig.web.json
│       ├── tsconfig.node.json
│       └── eslint.config.mjs
│
├── turbo.json
├── package.json
└── pnpm-lock.yaml
```

## 数据流设计

### SSE 数据流向

```
web (EventSource) → server (Hono SSE) → web (事件处理)
```

每个 SSE 场景的数据格式统一，事件名和数据结构定义在 `packages/shared` 中，server 和 web 都从这里导入，保证类型一致。

### 事件格式约定

定义在 `shared/constants/sse.ts`：

```ts
enum SseEvent {
  Message = 'message',   // 通用消息
  Done = 'done',         // 流结束信号
  Error = 'error',       // 错误
}
```

### shared 导出约定

- `types/sse.ts` — 响应数据的 TypeScript 类型
- `constants/sse.ts` — 事件名枚举、端点路径常量
- server 和 web 统一从 `@playground/shared` 导入，不在各自 app 里重复定义

## 错误处理

- **Server**：Hono 全局错误中间件捕获异常，通过 SSE `error` 事件推送给客户端，然后关闭流
- **Web**：`EventSource` 监听 `onerror`，同时监听自定义 `error` 事件，统一展示错误状态

## 测试策略

当前阶段是试验场，不引入单元测试框架，以人工验证为主：

- 每个场景页面有明确的"启动/停止"交互
- Server 日志输出请求和推送记录
- 后续如有需要可以按场景单独加测试
