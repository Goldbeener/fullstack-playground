/** 单条 SSE 消息的数据结构 */
export interface SseMessageData {
  content: string
}

/** SSE 错误事件的数据结构 */
export interface SseErrorData {
  message: string
}
