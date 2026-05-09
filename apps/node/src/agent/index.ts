import 'dotenv/config'
import { createAgent } from 'langchain'
import { model } from './model'
import { calculatorTool } from './tools'

/**
 * Step 3: 创建 Agent
 * -------------------
 * createAgent 是 LangChain v1 的核心入口，它把 model + tools + prompt 组合成一个
 * ReAct (Reasoning + Acting) agent。
 *
 * ReAct 循环的工作原理：
 * 1. 用户发送消息 → agent.invoke({ messages: [...] })
 * 2. Agent 将消息发给 LLM，让 LLM 思考是否需要调用工具
 * 3. 如果需要工具 → LLM 返回 tool call → agent 执行工具 → 结果返回 LLM
 * 4. LLM 根据工具结果继续推理或生成最终答案
 * 5. 循环直到 LLM 认为任务完成（不再调用工具）
 *
 * createAgent 参数：
 * - model: 决策引擎
 * - tools: 可用工具列表
 * - systemPrompt: 系统提示词，定义 agent 的行为边界和角色
 */
export const agent = createAgent({
  model,
  tools: [calculatorTool],
  systemPrompt: '你是一个有用的助手，可以使用计算器工具。',
})
