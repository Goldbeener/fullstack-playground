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
