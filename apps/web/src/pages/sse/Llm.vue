<template>
  <div>
    <h3>模拟 LLM 流式回复</h3>
    <p>逐字推送文本，模拟打字机效果。</p>
    <button @click="start" :disabled="connected">开始</button>
    <button @click="stop" :disabled="!connected">停止</button>
    <div v-if="status" style="margin-top: 1rem; color: gray;">{{ status }}</div>
    <div style="margin-top: 1rem; min-height: 3rem; border: 1px solid #ccc; padding: 0.5rem; white-space: pre-wrap;">
      {{ output }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createSseConnection } from '@/lib/sse'
import { SSE_ENDPOINTS } from '@playground/shared'

const output = ref('')
const status = ref('')
const connected = ref(false)
let close: (() => void) | null = null

function start() {
  output.value = ''
  status.value = '生成中...'
  connected.value = true
  close = createSseConnection(`http://localhost:3000${SSE_ENDPOINTS.llm}`, {
    onMessage: (content) => { output.value += content },
    onDone: () => { status.value = '已完成'; connected.value = false },
    onError: (msg) => { status.value = `错误: ${msg}`; connected.value = false },
    onNetworkError: () => { status.value = '连接断开'; connected.value = false },
  })
}

function stop() {
  close?.()
  close = null
  connected.value = false
  status.value = '已手动停止'
}
</script>
