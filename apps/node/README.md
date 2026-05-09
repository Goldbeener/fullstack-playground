# @playground/node

基于 LangChain + DeepSeek 的 Agent 验证环境。

## 快速开始

```bash
cp .env.example .env
# 编辑 .env，填入 DEEPSEEK_API_KEY
pnpm --filter node start
pnpm --filter node start "1+1等于几"  # 自定义问题
```

## 文件结构

```
src/
├── index.ts              # Step 4: 入口 — 构建消息，运行 agent
└── agent/
    ├── index.ts           # Step 3: 组装 — createAgent 创建 ReAct agent
    ├── model.ts           # Step 1: 大脑 — 定义 DeepSeek 模型
    └── tools.ts           # Step 2: 手脚 — 定义工具
```

## 关键步骤

### Step 1: 模型 (`agent/model.ts`)

agent 的"大脑"，负责理解意图、决定调用哪个工具、生成回复。

```ts
new ChatDeepSeek({ model: 'deepseek-chat', temperature: 0 })
```

| 参数 | 作用 |
|------|------|
| `model` | 具体模型名称 |
| `apiKey` | 从环境变量读取，不硬编码 |
| `temperature: 0` | 确定性输出，避免工具调用时产生幻觉 |

### Step 2: 工具 (`agent/tools.ts`)

agent 的"手脚"，让 LLM 能执行具体操作而不只是生成文本。

```ts
tool(fn, { name, description, schema })
```

| 要素 | 作用 |
|------|------|
| `name` | 模型识别工具的唯一标识 |
| `description` | 告诉模型何时使用此工具，写的越清楚，工具选择越准 |
| `schema` | Zod 定义输入字段，模型据此生成调用参数 |

### Step 3: 创建 Agent (`agent/index.ts`)

`createAgent` 将 model + tools + prompt 组合成 ReAct agent。

```
用户消息 → LLM 思考 → 需要工具？
                         ├─ 是 → 生成 tool call → 执行工具 → 结果返回 LLM → 继续思考
                         └─ 否 → 生成最终答案 → 结束
```

| 参数 | 作用 |
|------|------|
| `model` | 决策引擎 |
| `tools` | 可用工具列表 |
| `systemPrompt` | 系统提示词，定义 agent 的行为边界和角色 |

### Step 4: 运行 (`index.ts`)

构建消息，调用 agent：

```ts
const result = await agent.invoke({
  messages: [new HumanMessage(question)],
})
```

`result.messages` 包含完整对话链路：

```
[HumanMessage, AIMessage(tool call), ToolMessage(result), AIMessage(最终答案)]
```

最后一条消息即为 agent 的最终回复。

## 写新脚本

在 `src/` 下新建 `.ts` 文件，用 `tsx` 直接运行：

```bash
npx tsx src/my-experiment.ts
```
