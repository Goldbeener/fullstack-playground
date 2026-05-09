import { tool } from 'langchain'
import { z } from 'zod'

/**
 * Step 2: 定义工具 (Tools)
 * -------------------------
 * 工具是 agent 的"手脚"，让 LLM 能够执行具体操作而不仅仅是生成文本。
 *
 * 每个工具包含三个要素：
 * - name: 模型用来识别和选择工具的唯一标识
 * - description: 告诉模型这个工具"何时使用"（好的描述 = 正确的工具选择）
 * - schema: Zod schema，定义工具输入的类型和字段描述，模型会据此生成调用参数
 *
 * tool() 的第一个参数是执行函数，当模型决定调用此工具时触发。
 * 返回值会自动包装成 ToolMessage 追加到对话历史中。
 */
export const calculatorTool = tool(
  async ({ expression }) => {
    try {
      const result = eval(expression)
      return String(result)
    } catch {
      return 'Error: invalid expression'
    }
  },
  {
    name: 'calculator',
    description: '计算数学表达式，例如 "2 + 3 * 4"',
    schema: z.object({
      expression: z.string().describe('要计算的数学表达式'),
    }),
  }
)
