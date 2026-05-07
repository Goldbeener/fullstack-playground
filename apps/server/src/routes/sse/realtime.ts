import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { SseEvent } from '@playground/shared'

const realtime = new Hono()

realtime.get('/', (c) => {
  return streamSSE(c, async (stream) => {
    while (!stream.aborted) {
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
