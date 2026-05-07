<template>
  <div>
    <h3>实时数据推送</h3>
    <p>每秒推送一条实时数据，手动断开后停止。</p>
    <button @click="start" :disabled="connected">开始</button>
    <button @click="stop" :disabled="!connected">停止</button>
    <div v-if="status" style="margin-top: 1rem; color: gray;">{{ status }}</div>
    <ul style="max-height: 200px; overflow-y: auto;">
      <li v-for="(msg, i) in messages" :key="i">{{ msg }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createSseConnection } from '@/lib/sse'
import { SSE_ENDPOINTS } from '@playground/shared'

const messages = ref<string[]>([])
const status = ref('')
const connected = ref(false)
let close: (() => void) | null = null

function start() {
  messages.value = []
  status.value = '接收中...'
  connected.value = true
  close = createSseConnection(`http://localhost:3000${SSE_ENDPOINTS.realtime}`, {
    onMessage: (content) => messages.value.unshift(content),
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
