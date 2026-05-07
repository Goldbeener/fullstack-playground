import { SseEvent, SseMessageData, SseErrorData } from '@playground/shared'

export interface SseOptions {
  onMessage: (content: string) => void
  onDone: () => void
  onError: (message: string) => void
  onNetworkError: () => void
}

export function createSseConnection(url: string, options: SseOptions): () => void {
  const es = new EventSource(url)

  es.addEventListener(SseEvent.Message, (e) => {
    const data = JSON.parse(e.data) as SseMessageData
    options.onMessage(data.content)
  })

  es.addEventListener(SseEvent.Done, () => {
    options.onDone()
    es.close()
  })

  es.addEventListener(SseEvent.Error, (e) => {
    // Named server event `event: error\ndata: {...}` arrives as a MessageEvent.
    // Guard against connection-level errors (no .data) — let onerror handle those.
    const me = e as unknown as MessageEvent<string>
    if (!me.data) return
    const data = JSON.parse(me.data) as SseErrorData
    options.onError(data.message)
    es.close()
  })

  es.onerror = () => {
    options.onNetworkError()
    es.close()
  }

  return () => es.close()
}
