import { SseEvent } from '@playground/shared';
export function createSseConnection(url, options) {
    const es = new EventSource(url);
    es.addEventListener(SseEvent.Message, (e) => {
        const data = JSON.parse(e.data);
        options.onMessage(data.content);
    });
    es.addEventListener(SseEvent.Done, () => {
        options.onDone();
        es.close();
    });
    es.addEventListener(SseEvent.Error, (e) => {
        // Named server event `event: error\ndata: {...}` arrives as a MessageEvent.
        // Guard against connection-level errors (no .data) — let onerror handle those.
        const me = e;
        if (!me.data)
            return;
        const data = JSON.parse(me.data);
        options.onError(data.message);
        es.close();
    });
    es.onerror = () => {
        options.onNetworkError();
        es.close();
    };
    return () => es.close();
}
