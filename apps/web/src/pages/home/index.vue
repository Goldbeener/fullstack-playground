<template>
  <div style="padding: 2rem;">
    <h1>Playground</h1>
    <p>前后端场景试验场</p>
    <ul>
      <li><RouterLink to="/sse">SSE 场景</RouterLink></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
