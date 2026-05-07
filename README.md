# 项目设计

该项目是一个pnpm管理的monorepo项目

主要分为server 和 web 两端
用于验证需要前后端配合的场景，比如数据流式传输、sse等

```
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
│   │   │   ├── app/             # App Router 页面
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
│       ├── tsconfig.next.json   # Next.js 项目配置
│       ├── tsconfig.node.json   # Node/Workers 项目配置
│       └── biome.json           # Biome lint/format 配置
│
├── turbo.json                   # Turborepo 任务配置
├── package.json                 # 根 package.json
└── pnpm-lock.yaml
```


设计web、server；模拟streaming 流式读取