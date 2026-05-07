<template>
  <div>
    <h3>基础 SSE Demo</h3>
    <p>连接后每秒推送一条消息，共 5 条后结束。</p>
    <button @click="start" :disabled="connected">连接</button>
    <button @click="stop" :disabled="!connected">断开</button>
    <div v-if="status" style="margin-top: 1rem; color: gray;">{{ status }}</div>
    <ul>
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
  status.value = '已连接'
  connected.value = true
  close = createSseConnection(`http://localhost:3000${SSE_ENDPOINTS.demo}`, {
    onMessage: (content) => messages.value.push(content),
    onDone: () => { status.value = '已完成'; connected.value = false },
    onError: (msg) => { status.value = `错误: ${msg}`; connected.value = false },
    onNetworkError: () => { status.value = '连接断开'; connected.value = false },
  })
}

function stop() {
  close?.()
  close = null
  connected.value = false
  status.value = '已手动断开'
}
</script>
