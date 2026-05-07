<template>
  <div>
    <h3>分块传输</h3>
    <p>将数据分块推送，模拟大数据分批接收。</p>
    <button @click="start" :disabled="connected">开始</button>
    <button @click="stop" :disabled="!connected">停止</button>
    <div v-if="status" style="margin-top: 1rem; color: gray;">{{ status }}</div>
    <div style="margin-top: 1rem;">
      <div>已接收块数: {{ chunks }}</div>
      <div>已接收字符数: {{ totalChars }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createSseConnection } from '@/lib/sse'
import { SSE_ENDPOINTS } from '@playground/shared'

const chunks = ref(0)
const totalChars = ref(0)
const status = ref('')
const connected = ref(false)
let close: (() => void) | null = null

function start() {
  chunks.value = 0
  totalChars.value = 0
  status.value = '接收中...'
  connected.value = true
  close = createSseConnection(`http://localhost:3000${SSE_ENDPOINTS.chunked}`, {
    onMessage: (content) => {
      chunks.value++
      totalChars.value += content.length
    },
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
