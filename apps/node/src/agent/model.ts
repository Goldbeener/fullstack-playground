import { ChatDeepSeek } from '@langchain/deepseek'

/**
 * Step 1: 定义模型 (Model)
 * -----------------------
 * 模型是 agent 的"大脑"，负责理解用户意图、决策使用哪个工具、生成回复。
 *
 * 关键参数：
 * - model: 具体模型名称，deepseek-chat 是 DeepSeek 的通用对话模型
 * - apiKey: 从环境变量读取，不硬编码
 * - temperature: 0 = 确定性输出，适合工具调用场景（避免幻觉）
 */
export const model = new ChatDeepSeek({
  model: 'deepseek-chat',
  apiKey: process.env.DEEPSEEK_API_KEY,
  temperature: 0,
})
