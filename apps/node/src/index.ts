import * as readline from 'node:readline'
import { HumanMessage } from '@langchain/core/messages'
import { agent } from './agent'

function createPrompt() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return (q: string): Promise<string> =>
    new Promise((resolve) => rl.question(q, (a) => resolve(a)))
}

async function main() {
  const ask = createPrompt()

  console.log('Agent 就绪，输入 "exit" 退出\n')

  // 维护完整对话历史，每次 invoke 都传入所有历史消息
  let messages: any[] = []

  while (true) {
    const question = await ask('You > ')
    if (question === null) break // stdin closed (pipe EOF)
    if (!question.trim()) continue
    if (question.toLowerCase() === 'exit') break

    messages.push(new HumanMessage(question))

    process.stdout.write('\nAgent > ')
    const result = await agent.invoke({ messages })

    // 用返回的完整消息链替换当前历史，保持上下文连续
    messages = result.messages
    const lastMsg = messages[messages.length - 1]

    console.log(lastMsg.content)
    console.log()
  }

  console.log('Bye.')
  process.exit(0)
}

main().catch(console.error)
