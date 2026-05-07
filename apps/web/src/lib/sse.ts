import { SseEvent } from '@playground/shared'

export interface SseOptions {
  onMessage: (content: string) => void
  onDone: () => void
  onError: (message: string) => void
  onNetworkError: () => void
}

export function createSseConnection(url: string, options: SseOptions): () => void {
  const es = new EventSource(url)

  es.addEventListener(SseEvent.Message, (e) => {
    const data = JSON.parse(e.data) as { content: string }
    options.onMessage(data.content)
  })

  es.addEventListener(SseEvent.Done, () => {
    options.onDone()
    es.close()
  })

  es.addEventListener(SseEvent.Error, (e) => {
    const data = JSON.parse((e as MessageEvent).data) as { message: string }
    options.onError(data.message)
    es.close()
  })

  es.onerror = () => {
    options.onNetworkError()
    es.close()
  }

  return () => es.close()
}
