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
