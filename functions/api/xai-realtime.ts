const UPSTREAM =
    'https://api.x.ai/v1/realtime?agent_id=agent_zppRyL31HIbDZXGh';

interface Env {
    XAI_API_KEY?: string;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
    if (context.request.headers.get('Upgrade') !== 'websocket') {
        return new Response('Expected WebSocket', { status: 426 });
    }
    if (!context.env.XAI_API_KEY) {
        return new Response('XAI_API_KEY is not configured', { status: 500 });
    }

    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    server.accept();

    const queue: (string | ArrayBuffer)[] = [];
    let open = false;
    let upstream: WebSocket;
    try {
        const response = await fetch(UPSTREAM, {
            headers: {
                Upgrade: 'websocket',
                Authorization: `Bearer ${context.env.XAI_API_KEY}`,
            },
        });
        if (!response.webSocket) {
            server.close(1011, 'Upstream rejected');
            return new Response('Upstream rejected', { status: 502 });
        }
        upstream = response.webSocket;
        upstream.accept();
        open = true;
    } catch {
        server.close(1011, 'Upstream connection failed');
        return new Response('Upstream connection failed', { status: 502 });
    }

    server.addEventListener('message', (event) => {
        const data = event.data as string | ArrayBuffer;
        if (!open) queue.push(data);
        else upstream.send(data);
    });

    upstream.addEventListener('open', () => {
        open = true;
        for (const msg of queue) upstream.send(msg);
        queue.length = 0;
    });

    upstream.addEventListener('message', (event) => {
        server.send(event.data);
    });

    const closeBoth = () => {
        try { server.close(); } catch { /* already closed */ }
        try { upstream.close(); } catch { /* already closed */ }
    };

    server.addEventListener('close', closeBoth);
    server.addEventListener('error', closeBoth);
    upstream.addEventListener('close', closeBoth);
    upstream.addEventListener('error', () => {
        try {
            server.send(JSON.stringify({
                type: 'error',
                error: { message: 'Upstream connection failed' },
            }));
        } catch { /* closed */ }
        closeBoth();
    });

    return new Response(null, { status: 101, webSocket: client });
};
