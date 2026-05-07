# Playground Monorepo 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从零搭建 pnpm + Turborepo monorepo，包含 Hono server 和 Vue 3 web 两个 app，实现 SSE 场景的基础 demo、模拟 LLM、实时推送、分块传输四个子用例。

**Architecture:** 按场景分组的目录结构，每个场景在 server 和 web 各自有独立子目录。SSE 场景以 Hono SSE helper 实现服务端推送，Vue 3 用 `EventSource` 消费。共享类型和常量放在 `packages/shared`，两端统一从 `@playground/shared` 导入。

**Tech Stack:** pnpm workspaces, Turborepo, Hono (Node.js adapter), Vue 3 + Vite, TypeScript

---

## 文件结构总览

**新建文件：**

```
# monorepo 根配置
package.json
pnpm-workspace.yaml
turbo.json
.gitignore

# 共享配置
packages/config/package.json
packages/config/tsconfig.base.json
packages/config/tsconfig.node.json
packages/config/tsconfig.web.json
packages/config/eslint.config.mjs

# shared 包
packages/shared/package.json
packages/shared/tsconfig.json
packages/shared/src/types/sse.ts
packages/shared/src/constants/sse.ts
packages/shared/src/utils/index.ts
packages/shared/src/index.ts

# server app
apps/server/package.json
apps/server/tsconfig.json
apps/server/src/index.ts
apps/server/src/middleware/cors.ts
apps/server/src/middleware/logger.ts
apps/server/src/routes/index.ts
apps/server/src/routes/sse/index.ts
apps/server/src/routes/sse/demo.ts
apps/server/src/routes/sse/llm.ts
apps/server/src/routes/sse/realtime.ts
apps/server/src/routes/sse/chunked.ts

# web app
apps/web/package.json
apps/web/tsconfig.json
apps/web/index.html
apps/web/vite.config.ts
apps/web/src/main.ts
apps/web/src/App.vue
apps/web/src/router/index.ts
apps/web/src/lib/sse.ts
apps/web/src/pages/home/index.vue
apps/web/src/pages/sse/index.vue
apps/web/src/pages/sse/Demo.vue
apps/web/src/pages/sse/Llm.vue
apps/web/src/pages/sse/Realtime.vue
apps/web/src/pages/sse/Chunked.vue
```

---

## Task 1: 初始化 monorepo 根配置

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `.gitignore`

- [ ] **Step 1: 创建 `pnpm-workspace.yaml`**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

- [ ] **Step 2: 创建根 `package.json`**

```json
{
  "name": "playground",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint"
  },
  "devDependencies": {
    "turbo": "latest"
  }
}
```

- [ ] **Step 3: 创建 `turbo.json`**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "persistent": true,
      "cache": false
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

- [ ] **Step 4: 创建 `.gitignore`**

```
node_modules/
dist/
.turbo/
*.local
```

- [ ] **Step 5: 安装根依赖**

```bash
pnpm install
```

Expected: `node_modules/` 创建，`pnpm-lock.yaml` 生成

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-workspace.yaml turbo.json .gitignore pnpm-lock.yaml
git commit -m "chore: init monorepo root config"
```

---

## Task 2: 搭建 packages/config

**Files:**
- Create: `packages/config/package.json`
- Create: `packages/config/tsconfig.base.json`
- Create: `packages/config/tsconfig.node.json`
- Create: `packages/config/tsconfig.web.json`
- Create: `packages/config/eslint.config.mjs`

- [ ] **Step 1: 创建 `packages/config/package.json`**

```json
{
  "name": "@playground/config",
  "version": "0.0.1",
  "private": true,
  "exports": {
    "./eslint": "./eslint.config.mjs",
    "./tsconfig/base": "./tsconfig.base.json",
    "./tsconfig/node": "./tsconfig.node.json",
    "./tsconfig/web": "./tsconfig.web.json"
  }
}
```

- [ ] **Step 2: 创建 `packages/config/tsconfig.base.json`**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  }
}
```

- [ ] **Step 3: 创建 `packages/config/tsconfig.node.json`**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist"
  }
}
```

- [ ] **Step 4: 创建 `packages/config/tsconfig.web.json`**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "preserve",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "useDefineForClassFields": true
  }
}
```

- [ ] **Step 5: 创建 `packages/config/eslint.config.mjs`**

```js
import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    rules: {
      'no-console': 'warn',
    },
  },
]
```

- [ ] **Step 6: 安装 config 包的开发依赖**

```bash
pnpm --filter @playground/config add -D @eslint/js
```

- [ ] **Step 7: Commit**

```bash
git add packages/config/
git commit -m "chore: add shared config package (tsconfig + eslint)"
```

---

## Task 3: 搭建 packages/shared

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/types/sse.ts`
- Create: `packages/shared/src/constants/sse.ts`
- Create: `packages/shared/src/utils/index.ts`
- Create: `packages/shared/src/index.ts`

- [ ] **Step 1: 创建 `packages/shared/package.json`**

```json
{
  "name": "@playground/shared",
  "version": "0.0.1",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@playground/config": "workspace:*"
  }
}
```

- [ ] **Step 2: 创建 `packages/shared/tsconfig.json`**

```json
{
  "extends": "@playground/config/tsconfig/base",
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: 创建 `packages/shared/src/types/sse.ts`**

```ts
/** 单条 SSE 消息的数据结构 */
export interface SseMessageData {
  content: string
}

/** SSE 错误事件的数据结构 */
export interface SseErrorData {
  message: string
}
```

- [ ] **Step 4: 创建 `packages/shared/src/constants/sse.ts`**

```ts
/** SSE 事件类型 */
export enum SseEvent {
  Message = 'message',
  Done = 'done',
  Error = 'error',
}

/** SSE 端点路径 */
export const SSE_ENDPOINTS = {
  demo: '/sse/demo',
  llm: '/sse/llm',
  realtime: '/sse/realtime',
  chunked: '/sse/chunked',
} as const
```

- [ ] **Step 5: 创建 `packages/shared/src/utils/index.ts`**

```ts
// 预留，后续按需添加共享工具函数
export {}
```

- [ ] **Step 6: 创建 `packages/shared/src/index.ts`**

```ts
export * from './types/sse'
export * from './constants/sse'
export * from './utils/index'
```

- [ ] **Step 7: 安装依赖并构建 shared**

```bash
pnpm install
pnpm --filter @playground/shared build
```

Expected: `packages/shared/dist/` 目录生成，包含 `.js` 和 `.d.ts` 文件

- [ ] **Step 8: Commit**

```bash
git add packages/shared/
git commit -m "feat: add shared package with SSE types and constants"
```

---

## Task 4: 搭建 apps/server 骨架

**Files:**
- Create: `apps/server/package.json`
- Create: `apps/server/tsconfig.json`
- Create: `apps/server/src/middleware/cors.ts`
- Create: `apps/server/src/middleware/logger.ts`
- Create: `apps/server/src/routes/index.ts`
- Create: `apps/server/src/index.ts`

- [ ] **Step 1: 创建 `apps/server/package.json`**

```json
{
  "name": "@playground/server",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@hono/node-server": "^1.0.0",
    "hono": "^4.0.0",
    "@playground/shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tsx": "^4.0.0",
    "@playground/config": "workspace:*"
  }
}
```

- [ ] **Step 2: 创建 `apps/server/tsconfig.json`**

```json
{
  "extends": "@playground/config/tsconfig/node",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: 创建 `apps/server/src/middleware/cors.ts`**

```ts
import { cors } from 'hono/cors'

export const corsMiddleware = cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
})
```

- [ ] **Step 4: 创建 `apps/server/src/middleware/logger.ts`**

```ts
import { logger } from 'hono/logger'

export const loggerMiddleware = logger()
```

- [ ] **Step 5: 创建 `apps/server/src/routes/index.ts`（暂时为空，后续任务填充）**

```ts
import { Hono } from 'hono'

const router = new Hono()

// 场景路由将在此挂载

export default router
```

- [ ] **Step 6: 创建 `apps/server/src/index.ts`**

```ts
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { corsMiddleware } from './middleware/cors.js'
import { loggerMiddleware } from './middleware/logger.js'
import router from './routes/index.js'

const app = new Hono()

app.use('*', loggerMiddleware)
app.use('*', corsMiddleware)
app.route('/', router)

app.get('/health', (c) => c.json({ status: 'ok' }))

const port = 3000
console.log(`Server running on http://localhost:${port}`)

serve({ fetch: app.fetch, port })
```

- [ ] **Step 7: 安装依赖**

```bash
pnpm install
```

- [ ] **Step 8: 验证 server 能启动**

```bash
pnpm --filter @playground/server dev
```

Expected: 控制台输出 `Server running on http://localhost:3000`，访问 `http://localhost:3000/health` 返回 `{"status":"ok"}`

- [ ] **Step 9: Commit**

```bash
git add apps/server/
git commit -m "feat: scaffold server app with Hono, cors, logger middleware"
```

---

## Task 5: 实现 SSE server 路由

**Files:**
- Create: `apps/server/src/routes/sse/demo.ts`
- Create: `apps/server/src/routes/sse/llm.ts`
- Create: `apps/server/src/routes/sse/realtime.ts`
- Create: `apps/server/src/routes/sse/chunked.ts`
- Create: `apps/server/src/routes/sse/index.ts`
- Modify: `apps/server/src/routes/index.ts`

- [ ] **Step 1: 创建 `apps/server/src/routes/sse/demo.ts`**

基础 SSE demo：连接后每秒推送一条消息，共推送 5 条后结束。

```ts
import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { SseEvent } from '@playground/shared'

const demo = new Hono()

demo.get('/', (c) => {
  return streamSSE(c, async (stream) => {
    for (let i = 1; i <= 5; i++) {
      await stream.writeSSE({
        event: SseEvent.Message,
        data: JSON.stringify({ content: `消息 ${i}` }),
      })
      await stream.sleep(1000)
    }
    await stream.writeSSE({ event: SseEvent.Done, data: '' })
  })
})

export default demo
```

- [ ] **Step 2: 创建 `apps/server/src/routes/sse/llm.ts`**

模拟 LLM 流式回复：将一段文本逐字推送，模拟 token 流。

```ts
import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { SseEvent } from '@playground/shared'

const llm = new Hono()

const MOCK_TEXT = '这是一段模拟 LLM 流式输出的文本，每个字符会逐个推送到客户端，模拟真实 AI 回复的打字机效果。'

llm.get('/', (c) => {
  return streamSSE(c, async (stream) => {
    for (const char of MOCK_TEXT) {
      await stream.writeSSE({
        event: SseEvent.Message,
        data: JSON.stringify({ content: char }),
      })
      await stream.sleep(50)
    }
    await stream.writeSSE({ event: SseEvent.Done, data: '' })
  })
})

export default llm
```

- [ ] **Step 3: 创建 `apps/server/src/routes/sse/realtime.ts`**

实时数据推送：每秒推送一条模拟的实时数据（如时间戳 + 随机数值），持续推送直到客户端断开。

```ts
import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { SseEvent } from '@playground/shared'

const realtime = new Hono()

realtime.get('/', (c) => {
  return streamSSE(c, async (stream) => {
    while (true) {
      if ((await stream.isConnectionOpen()) === false) break
      await stream.writeSSE({
        event: SseEvent.Message,
        data: JSON.stringify({
          content: `${new Date().toISOString()} | value: ${(Math.random() * 100).toFixed(2)}`,
        }),
      })
      await stream.sleep(1000)
    }
  })
})

export default realtime
```

- [ ] **Step 4: 创建 `apps/server/src/routes/sse/chunked.ts`**

分块传输：将一段较大的文本分成固定大小的块，逐块推送。

```ts
import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { SseEvent } from '@playground/shared'

const chunked = new Hono()

const MOCK_DATA = 'A'.repeat(500)
const CHUNK_SIZE = 50

chunked.get('/', (c) => {
  return streamSSE(c, async (stream) => {
    for (let i = 0; i < MOCK_DATA.length; i += CHUNK_SIZE) {
      const chunk = MOCK_DATA.slice(i, i + CHUNK_SIZE)
      await stream.writeSSE({
        event: SseEvent.Message,
        data: JSON.stringify({ content: chunk }),
      })
      await stream.sleep(200)
    }
    await stream.writeSSE({ event: SseEvent.Done, data: '' })
  })
})

export default chunked
```

- [ ] **Step 5: 创建 `apps/server/src/routes/sse/index.ts`**

```ts
import { Hono } from 'hono'
import demo from './demo.js'
import llm from './llm.js'
import realtime from './realtime.js'
import chunked from './chunked.js'

const sseRouter = new Hono()

sseRouter.route('/demo', demo)
sseRouter.route('/llm', llm)
sseRouter.route('/realtime', realtime)
sseRouter.route('/chunked', chunked)

export default sseRouter
```

- [ ] **Step 6: 修改 `apps/server/src/routes/index.ts`，挂载 SSE 子路由**

```ts
import { Hono } from 'hono'
import sseRouter from './sse/index.js'

const router = new Hono()

router.route('/sse', sseRouter)

export default router
```

- [ ] **Step 7: 启动 server，手动验证各端点**

```bash
pnpm --filter @playground/server dev
```

用 curl 验证（分别在不同终端运行）：

```bash
curl -N http://localhost:3000/sse/demo
curl -N http://localhost:3000/sse/llm
curl -N http://localhost:3000/sse/realtime   # Ctrl+C 手动停止
curl -N http://localhost:3000/sse/chunked
```

Expected: 每个端点均输出 SSE 格式数据流，demo/llm/chunked 在完成后输出 `event: done`，realtime 持续输出直到手动停止

- [ ] **Step 8: Commit**

```bash
git add apps/server/src/routes/
git commit -m "feat: implement SSE routes (demo, llm, realtime, chunked)"
```

---

## Task 6: 搭建 apps/web 骨架

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/index.html`
- Create: `apps/web/vite.config.ts`
- Create: `apps/web/src/main.ts`
- Create: `apps/web/src/App.vue`
- Create: `apps/web/src/router/index.ts`
- Create: `apps/web/src/lib/sse.ts`

- [ ] **Step 1: 创建 `apps/web/package.json`**

```json
{
  "name": "@playground/web",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.0.0",
    "@playground/shared": "workspace:*"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vue-tsc": "^2.0.0",
    "@playground/config": "workspace:*"
  }
}
```

- [ ] **Step 2: 创建 `apps/web/tsconfig.json`**

```json
{
  "extends": "@playground/config/tsconfig/web",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.vue", "vite.config.ts"]
}
```

- [ ] **Step 3: 创建 `apps/web/index.html`**

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Playground</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 4: 创建 `apps/web/vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
})
```

- [ ] **Step 5: 创建 `apps/web/src/router/index.ts`**

```ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/pages/home/index.vue'),
    },
    {
      path: '/sse',
      component: () => import('@/pages/sse/index.vue'),
      children: [
        { path: 'demo', component: () => import('@/pages/sse/Demo.vue') },
        { path: 'llm', component: () => import('@/pages/sse/Llm.vue') },
        { path: 'realtime', component: () => import('@/pages/sse/Realtime.vue') },
        { path: 'chunked', component: () => import('@/pages/sse/Chunked.vue') },
      ],
    },
  ],
})

export default router
```

- [ ] **Step 6: 创建 `apps/web/src/lib/sse.ts`**

封装 EventSource 的连接、消息处理和关闭逻辑，所有 SSE 页面通过此函数接入。

```ts
import { SseEvent } from '@playground/shared'

export interface SseOptions {
  onMessage: (content: string) => void
  onDone: () => void
  onError: (message: string) => void
  onNetworkError: () => void
}

export function createSseConnection(url: string, options: SseOptions): () => void {
  const es = new EventSource(url)

  es.addEventListener(SseEvent.Message, (e) => {
    const data = JSON.parse(e.data) as { content: string }
    options.onMessage(data.content)
  })

  es.addEventListener(SseEvent.Done, () => {
    options.onDone()
    es.close()
  })

  es.addEventListener(SseEvent.Error, (e) => {
    const data = JSON.parse((e as MessageEvent).data) as { message: string }
    options.onError(data.message)
    es.close()
  })

  es.onerror = () => {
    options.onNetworkError()
    es.close()
  }

  // 返回关闭函数，供调用方手动关闭
  return () => es.close()
}
```

- [ ] **Step 7: 创建 `apps/web/src/main.ts`**

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'

createApp(App).use(router).mount('#app')
```

- [ ] **Step 8: 创建 `apps/web/src/App.vue`**

```vue
<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
```

- [ ] **Step 9: 安装依赖并验证 web 能启动**

```bash
pnpm install
pnpm --filter @playground/web dev
```

Expected: 浏览器访问 `http://localhost:5173` 不报错（页面为空白正常，路由页面尚未创建）

- [ ] **Step 10: Commit**

```bash
git add apps/web/
git commit -m "feat: scaffold web app with Vue 3, Vite, Vue Router"
```

---

## Task 7: 实现 web 页面

**Files:**
- Create: `apps/web/src/pages/home/index.vue`
- Create: `apps/web/src/pages/sse/index.vue`
- Create: `apps/web/src/pages/sse/Demo.vue`
- Create: `apps/web/src/pages/sse/Llm.vue`
- Create: `apps/web/src/pages/sse/Realtime.vue`
- Create: `apps/web/src/pages/sse/Chunked.vue`

- [ ] **Step 1: 创建首页 `apps/web/src/pages/home/index.vue`**

```vue
<template>
  <div style="padding: 2rem;">
    <h1>Playground</h1>
    <p>前后端场景试验场</p>
    <ul>
      <li><RouterLink to="/sse">SSE 场景</RouterLink></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
```

- [ ] **Step 2: 创建 SSE 场景入口 `apps/web/src/pages/sse/index.vue`**

```vue
<template>
  <div style="padding: 2rem;">
    <h2>SSE 场景</h2>
    <nav>
      <RouterLink to="/sse/demo">基础 Demo</RouterLink> |
      <RouterLink to="/sse/llm">模拟 LLM</RouterLink> |
      <RouterLink to="/sse/realtime">实时推送</RouterLink> |
      <RouterLink to="/sse/chunked">分块传输</RouterLink>
    </nav>
    <hr />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
```

- [ ] **Step 3: 创建 `apps/web/src/pages/sse/Demo.vue`**

```vue
<template>
  <div>
    <h3>基础 SSE Demo</h3>
    <p>连接后每秒推送一条消息，共 5 条后结束。</p>
    <button @click="start" :disabled="connected">连接</button>
    <button @click="stop" :disabled="!connected">断开</button>
    <div v-if="status" style="margin-top: 1rem; color: gray;">{{ status }}</div>
    <ul>
      <li v-for="(msg, i) in messages" :key="i">{{ msg }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createSseConnection } from '@/lib/sse'
import { SSE_ENDPOINTS } from '@playground/shared'

const messages = ref<string[]>([])
const status = ref('')
const connected = ref(false)
let close: (() => void) | null = null

function start() {
  messages.value = []
  status.value = '已连接'
  connected.value = true
  close = createSseConnection(`http://localhost:3000${SSE_ENDPOINTS.demo}`, {
    onMessage: (content) => messages.value.push(content),
    onDone: () => { status.value = '已完成'; connected.value = false },
    onError: (msg) => { status.value = `错误: ${msg}`; connected.value = false },
    onNetworkError: () => { status.value = '连接断开'; connected.value = false },
  })
}

function stop() {
  close?.()
  close = null
  connected.value = false
  status.value = '已手动断开'
}
</script>
```

- [ ] **Step 4: 创建 `apps/web/src/pages/sse/Llm.vue`**

```vue
<template>
  <div>
    <h3>模拟 LLM 流式回复</h3>
    <p>逐字推送文本，模拟打字机效果。</p>
    <button @click="start" :disabled="connected">开始</button>
    <button @click="stop" :disabled="!connected">停止</button>
    <div v-if="status" style="margin-top: 1rem; color: gray;">{{ status }}</div>
    <div style="margin-top: 1rem; min-height: 3rem; border: 1px solid #ccc; padding: 0.5rem; white-space: pre-wrap;">
      {{ output }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createSseConnection } from '@/lib/sse'
import { SSE_ENDPOINTS } from '@playground/shared'

const output = ref('')
const status = ref('')
const connected = ref(false)
let close: (() => void) | null = null

function start() {
  output.value = ''
  status.value = '生成中...'
  connected.value = true
  close = createSseConnection(`http://localhost:3000${SSE_ENDPOINTS.llm}`, {
    onMessage: (content) => { output.value += content },
    onDone: () => { status.value = '已完成'; connected.value = false },
    onError: (msg) => { status.value = `错误: ${msg}`; connected.value = false },
    onNetworkError: () => { status.value = '连接断开'; connected.value = false },
  })
}

function stop() {
  close?.()
  close = null
  connected.value = false
  status.value = '已手动停止'
}
</script>
```

- [ ] **Step 5: 创建 `apps/web/src/pages/sse/Realtime.vue`**

```vue
<template>
  <div>
    <h3>实时数据推送</h3>
    <p>每秒推送一条实时数据，手动断开后停止。</p>
    <button @click="start" :disabled="connected">开始</button>
    <button @click="stop" :disabled="!connected">停止</button>
    <div v-if="status" style="margin-top: 1rem; color: gray;">{{ status }}</div>
    <ul style="max-height: 200px; overflow-y: auto;">
      <li v-for="(msg, i) in messages" :key="i">{{ msg }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createSseConnection } from '@/lib/sse'
import { SSE_ENDPOINTS } from '@playground/shared'

const messages = ref<string[]>([])
const status = ref('')
const connected = ref(false)
let close: (() => void) | null = null

function start() {
  messages.value = []
  status.value = '接收中...'
  connected.value = true
  close = createSseConnection(`http://localhost:3000${SSE_ENDPOINTS.realtime}`, {
    onMessage: (content) => messages.value.unshift(content),
    onDone: () => { status.value = '已完成'; connected.value = false },
    onError: (msg) => { status.value = `错误: ${msg}`; connected.value = false },
    onNetworkError: () => { status.value = '连接断开'; connected.value = false },
  })
}

function stop() {
  close?.()
  close = null
  connected.value = false
  status.value = '已手动停止'
}
</script>
```

- [ ] **Step 6: 创建 `apps/web/src/pages/sse/Chunked.vue`**

```vue
<template>
  <div>
    <h3>分块传输</h3>
    <p>将数据分块推送，模拟大数据分批接收。</p>
    <button @click="start" :disabled="connected">开始</button>
    <button @click="stop" :disabled="!connected">停止</button>
    <div v-if="status" style="margin-top: 1rem; color: gray;">{{ status }}</div>
    <div style="margin-top: 1rem;">
      <div>已接收块数: {{ chunks }}</div>
      <div>已接收字符数: {{ totalChars }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createSseConnection } from '@/lib/sse'
import { SSE_ENDPOINTS } from '@playground/shared'

const chunks = ref(0)
const totalChars = ref(0)
const status = ref('')
const connected = ref(false)
let close: (() => void) | null = null

function start() {
  chunks.value = 0
  totalChars.value = 0
  status.value = '接收中...'
  connected.value = true
  close = createSseConnection(`http://localhost:3000${SSE_ENDPOINTS.chunked}`, {
    onMessage: (content) => {
      chunks.value++
      totalChars.value += content.length
    },
    onDone: () => { status.value = '已完成'; connected.value = false },
    onError: (msg) => { status.value = `错误: ${msg}`; connected.value = false },
    onNetworkError: () => { status.value = '连接断开'; connected.value = false },
  })
}

function stop() {
  close?.()
  close = null
  connected.value = false
  status.value = '已手动停止'
}
</script>
```

- [ ] **Step 7: 启动 server 和 web，人工验证所有场景**

```bash
# 终端 1
pnpm --filter @playground/server dev

# 终端 2
pnpm --filter @playground/web dev
```

打开 `http://localhost:5173`，依次验证：
- 首页显示场景导航
- `/sse/demo`：点击连接，每秒出现一条消息，5 条后状态变为"已完成"
- `/sse/llm`：点击开始，文字逐个出现，完成后状态变为"已完成"
- `/sse/realtime`：点击开始，数据持续滚动，点停止后停止
- `/sse/chunked`：点击开始，块数和字符数不断增加，完成后显示总计

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/pages/
git commit -m "feat: implement SSE demo pages (demo, llm, realtime, chunked)"
```

---

## Task 8: 补充 README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 更新 README.md，补充架构设计内容**

在现有目录结构后追加以下内容：

```markdown
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
pnpm dev            # 启动所有 app（需两个终端分别访问）
```

server: `http://localhost:3000`  
web: `http://localhost:5173`
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README with architecture and dev guide"
```
