/** SSE 事件类型 */
export enum SseEvent {
  Message = 'message',
  Done = 'done',
  Error = 'error',
}

/** SSE 端点路径 */
export const SSE_ENDPOINTS = {
  demo: '/sse/demo',
  llm: '/sse/llm',
  realtime: '/sse/realtime',
  chunked: '/sse/chunked',
} as const
