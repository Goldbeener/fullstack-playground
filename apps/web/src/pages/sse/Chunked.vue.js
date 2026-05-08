/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref } from 'vue';
import { createSseConnection } from '@/lib/sse';
import { SSE_ENDPOINTS } from '@playground/shared';
const chunks = ref(0);
const totalChars = ref(0);
const status = ref('');
const connected = ref(false);
let close = null;
function start() {
    chunks.value = 0;
    totalChars.value = 0;
    status.value = '接收中...';
    connected.value = true;
    close = createSseConnection(`http://localhost:3000${SSE_ENDPOINTS.chunked}`, {
        onMessage: (content) => {
            chunks.value++;
            totalChars.value += content.length;
        },
        onDone: () => { status.value = '已完成'; connected.value = false; },
        onError: (msg) => { status.value = `错误: ${msg}`; connected.value = false; },
        onNetworkError: () => { status.value = '连接断开'; connected.value = false; },
    });
}
function stop() {
    close?.();
    close = null;
    connected.value = false;
    status.value = '已手动停止';
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.start) },
    disabled: (__VLS_ctx.connected),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.stop) },
    disabled: (!__VLS_ctx.connected),
});
if (__VLS_ctx.status) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    (__VLS_ctx.status);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
(__VLS_ctx.chunks);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
(__VLS_ctx.totalChars);
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            chunks: chunks,
            totalChars: totalChars,
            status: status,
            connected: connected,
            start: start,
            stop: stop,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
