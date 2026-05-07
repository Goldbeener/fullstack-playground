import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/pages/home/index.vue'),
    },
    {
      path: '/sse',
      component: () => import('@/pages/sse/index.vue'),
      children: [
        { path: 'demo', component: () => import('@/pages/sse/Demo.vue') },
        { path: 'llm', component: () => import('@/pages/sse/Llm.vue') },
        { path: 'realtime', component: () => import('@/pages/sse/Realtime.vue') },
        { path: 'chunked', component: () => import('@/pages/sse/Chunked.vue') },
      ],
    },
  ],
})

export default router
