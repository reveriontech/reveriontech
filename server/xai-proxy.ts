import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';
import type { Plugin } from 'vite';
import { WebSocket, WebSocketServer, type RawData } from 'ws';

const UPSTREAM =
    'wss://api.x.ai/v1/realtime?agent_id=agent_zppRyL31HIbDZXGh';

export function xaiRealtimeProxy(apiKey: string | undefined): Plugin {
    return {
        name: 'xai-realtime-proxy',
        configureServer(server) {
            const wss = new WebSocketServer({ noServer: true });
            server.httpServer?.prependListener(
                'upgrade',
                (req: IncomingMessage, socket: Duplex, head: Buffer) => {
                    const path = (req.url ?? '').split('?')[0];
                    if (path !== '/api/xai-realtime') return;

                    wss.handleUpgrade(req, socket, head, (client) => {
                        if (!apiKey) {
                            client.send(JSON.stringify({
                                type: 'error',
                                error: { message: 'XAI_API_KEY is not set' },
                            }));
                            client.close();
                            return;
                        }

                        const upstream = new WebSocket(UPSTREAM, {
                            headers: { Authorization: `Bearer ${apiKey}` },
                        });
                        const queue: Array<RawData | string> = [];
                        let open = false;

                        const asFrame = (data: RawData, isBinary: boolean) =>
                            isBinary ? data : data.toString();

                        client.on('message', (data, isBinary) => {
                            const frame = asFrame(data, isBinary);
                            if (!open) queue.push(frame);
                            else upstream.send(frame);
                        });

                        upstream.on('open', () => {
                            open = true;
                            for (const msg of queue) upstream.send(msg);
                            queue.length = 0;
                        });

                        upstream.on('message', (data, isBinary) => {
                            if (client.readyState === WebSocket.OPEN) client.send(asFrame(data, isBinary));
                        });

                        const closeBoth = () => {
                            if (client.readyState === WebSocket.OPEN) client.close();
                            if (upstream.readyState === WebSocket.OPEN) upstream.close();
                        };

                        upstream.on('error', () => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({
                                    type: 'error',
                                    error: { message: 'Upstream connection failed' },
                                }));
                            }
                            closeBoth();
                        });
                        client.on('error', closeBoth);
                        client.on('close', closeBoth);
                        upstream.on('close', closeBoth);
                    });
                },
            );
        },
    };
}
