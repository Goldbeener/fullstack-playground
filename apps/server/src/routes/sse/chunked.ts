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
