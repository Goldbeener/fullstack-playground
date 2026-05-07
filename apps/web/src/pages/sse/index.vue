<template>
  <div style="padding: 2rem;">
    <h2>SSE 场景</h2>
    <nav>
      <RouterLink to="/sse/demo">基础 Demo</RouterLink> |
      <RouterLink to="/sse/llm">模拟 LLM</RouterLink> |
      <RouterLink to="/sse/realtime">实时推送</RouterLink> |
      <RouterLink to="/sse/chunked">分块传输</RouterLink>
    </nav>
    <hr />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
