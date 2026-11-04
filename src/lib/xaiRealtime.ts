import { withCompanyFacts } from './agentKnowledge';

type XaiEvent = Record<string, unknown> & { type?: string };

const TARGET_RATE = 24000;

type Listener = (event: XaiEvent) => void;

const listeners = new Set<Listener>();

let socket: WebSocket | null = null;
let opening: Promise<WebSocket> | null = null;

let audioCtx: AudioContext | null = null;
let nextTime = 0;
let savedTools: unknown[] | undefined;
let savedInstructions = '';
let knowledgeSource = '';
let callActive = false;
let callStream: MediaStream | null = null;
let callCtx: AudioContext | null = null;
let callNode: AudioNode | null = null;

export function onXaiEvent(listener: Listener) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

let responseInProgress = false;
const idleWaiters: Array<() => void> = [];

function emit(event: XaiEvent) {
    syncKnowledge(event);
    if (event.type === 'response.created') responseInProgress = true;
    if (event.type === 'response.done' || event.type === 'error') {
        responseInProgress = false;
        const waiters = idleWaiters.splice(0);
        waiters.forEach((waiter) => waiter());
    }
    listeners.forEach((listener) => listener(event));
}

async function readFrame(data: unknown) {
    if (typeof data === 'string') return data;
    if (data instanceof Blob) return data.text();
    if (data instanceof ArrayBuffer) return new TextDecoder().decode(data);
    return '';
}

function syncKnowledge(event: XaiEvent) {
    if (event.type !== 'session.updated' && event.type !== 'session.created') return;
    const session = event.session as { instructions?: string; tools?: unknown[] } | undefined;
    if (!session?.instructions) return;
    if (Array.isArray(session.tools) && session.tools.length) savedTools = session.tools;
    if (session.instructions.includes('212 N. 2nd St. Ste 100')) {
        savedInstructions = session.instructions;
        return;
    }
    if (knowledgeSource === session.instructions || socket?.readyState !== WebSocket.OPEN) return;
    knowledgeSource = session.instructions;
    const next = withCompanyFacts(session.instructions);
    savedInstructions = next;
    socket?.send(JSON.stringify({
        type: 'session.update',
        session: {
            instructions: next,
            ...(savedTools ? { tools: savedTools } : {}),
        },
    }));
}

function sessionPayload(extra: Record<string, unknown>) {
    return {
        type: 'session.update',
        session: {
            ...(savedInstructions ? { instructions: savedInstructions } : {}),
            ...(savedTools ? { tools: savedTools } : {}),
            ...extra,
        },
    };
}

function waitForKnowledge() {
    if (savedInstructions.includes('212 N. 2nd St')) return Promise.resolve();
    return new Promise<void>((resolve) => {
        const stop = onXaiEvent(() => {
            if (!savedInstructions.includes('212 N. 2nd St')) return;
            stop();
            clearTimeout(timer);
            resolve();
        });
        const timer = setTimeout(() => {
            stop();
            resolve();
        }, 4000);
    });
}

function floatToPcm16(input: Float32Array, inRate: number) {
    const ratio = inRate / TARGET_RATE;
    const length = inRate === TARGET_RATE ? input.length : Math.floor(input.length / ratio);
    const out = new Int16Array(length);
    for (let i = 0; i < length; i++) {
        let sample = input[i] ?? 0;
        if (inRate !== TARGET_RATE) {
            const start = Math.floor(i * ratio);
            const end = Math.min(input.length, Math.floor((i + 1) * ratio));
            let sum = 0;
            let count = 0;
            for (let j = start; j < end; j++) {
                sum += input[j] ?? 0;
                count++;
            }
            sample = count ? sum / count : 0;
        }
        const clamped = Math.max(-1, Math.min(1, sample));
        out[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    }
    return out;
}

function pcm16Base64(samples: Int16Array) {
    const bytes = new Uint8Array(samples.buffer, samples.byteOffset, samples.byteLength);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
        binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return btoa(binary);
}

function sendMic(samples: Float32Array, inRate: number) {
    if (!callActive || socket?.readyState !== WebSocket.OPEN) return;
    const pcm = floatToPcm16(samples, inRate);
    if (!pcm.length) return;
    socket.send(JSON.stringify({ type: 'input_audio_buffer.append', audio: pcm16Base64(pcm) }));
}

const workletSource = `
class PcmCapture extends AudioWorkletProcessor {
  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (channel) this.port.postMessage(channel);
    return true;
  }
}
registerProcessor('pcm-capture', PcmCapture);
`;

async function attachMic(stream: MediaStream) {
    const ctx = new AudioContext();
    callCtx = ctx;
    const source = ctx.createMediaStreamSource(stream);
    const sink = ctx.createGain();
    sink.gain.value = 0;
    const url = URL.createObjectURL(new Blob([workletSource], { type: 'text/javascript' }));
    try {
        await ctx.audioWorklet.addModule(url);
        const node = new AudioWorkletNode(ctx, 'pcm-capture');
        node.port.onmessage = (event) => sendMic(event.data as Float32Array, ctx.sampleRate);
        source.connect(node);
        node.connect(sink);
        callNode = node;
    } catch {
        const processor = ctx.createScriptProcessor(4096, 1, 1);
        processor.onaudioprocess = (event) => sendMic(event.inputBuffer.getChannelData(0), ctx.sampleRate);
        source.connect(processor);
        processor.connect(sink);
        callNode = processor;
    } finally {
        URL.revokeObjectURL(url);
    }
    sink.connect(ctx.destination);
    await ctx.resume();
}

export function isVoiceCallActive() {
    return callActive;
}

function releaseMic() {
    callActive = false;
    callStream?.getTracks().forEach((track) => track.stop());
    callStream = null;
    callNode?.disconnect();
    callNode = null;
    void callCtx?.close();
    callCtx = null;
}

export async function startVoiceCall() {
    if (callActive) return;
    const ws = await connectXai();
    await waitForKnowledge();
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
    });
    ws.send(JSON.stringify(sessionPayload({
        turn_detection: { type: 'server_vad' },
        audio: {
            input: {
                format: { type: 'audio/pcm', rate: TARGET_RATE },
                transcription: { model: 'grok-transcribe' },
            },
            output: { format: { type: 'audio/pcm', rate: TARGET_RATE } },
        },
    })));
    callStream = stream;
    callActive = true;
    try {
        await attachMic(stream);
    } catch (error) {
        stopVoiceCall();
        throw error;
    }
    if (!responseInProgress && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'response.create' }));
    }
}

export function stopVoiceCall() {
    const live = callActive || callStream;
    releaseMic();
    if (!live || socket?.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: 'input_audio_buffer.clear' }));
    socket.send(JSON.stringify(sessionPayload({ turn_detection: null })));
}

function socketUrl() {
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${proto}//${window.location.host}/api/xai-realtime`;
}

export function connectXai(): Promise<WebSocket> {
    if (socket?.readyState === WebSocket.OPEN) return Promise.resolve(socket);
    if (opening) return opening;

    opening = new Promise((resolve, reject) => {
        const ws = new WebSocket(socketUrl());
        const fail = () => {
            opening = null;
            reject(new Error('WebSocket error'));
        };
        ws.addEventListener('open', () => {
            socket = ws;
            knowledgeSource = '';
            opening = null;
            resolve(ws);
        }, { once: true });
        ws.addEventListener('error', fail);
        ws.addEventListener('message', (ev) => {
            void readFrame(ev.data).then((raw) => {
                if (!raw) return;
                try {
                    emit(JSON.parse(raw) as XaiEvent);
                } catch {
                    /* ignore non-json */
                }
            });
        });
        ws.addEventListener('close', () => {
            releaseMic();
            if (socket === ws) socket = null;
            opening = null;
            emit({ type: 'proxy.close' });
        });
    });

    return opening;
}

function waitUntilIdle() {
    return new Promise<void>((resolve) => {
        let settled = false;
        const finish = () => {
            if (settled) return;
            settled = true;
            resolve();
        };
        if (responseInProgress) {
            idleWaiters.push(finish);
            return;
        }
        const stop = onXaiEvent((event) => {
            if (event.type !== 'response.created') return;
            stop();
            clearTimeout(timer);
            idleWaiters.push(finish);
        });
        const timer = setTimeout(() => {
            stop();
            finish();
        }, 2000);
    });
}

function waitForUserItem() {
    return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => {
            stop();
            reject(new Error('Timed out waiting for the user turn'));
        }, 10000);
        const stop = onXaiEvent((event) => {
            if (event.type !== 'conversation.item.added') return;
            const item = event.item as { role?: string } | undefined;
            if (item?.role !== 'user') return;
            clearTimeout(timer);
            stop();
            resolve();
        });
    });
}

export async function sendUserTurn(text: string, onReady?: () => void) {
    const ws = await connectXai();
    await waitUntilIdle();
    ws.send(JSON.stringify({
        type: 'conversation.item.create',
        item: {
            type: 'message',
            role: 'user',
            content: [{ type: 'input_text', text }],
        },
    }));
    await waitForUserItem();
    onReady?.();
    ws.send(JSON.stringify({ type: 'response.create' }));
}

export function sendFunctionOutput(callId: string, output: string) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({
        type: 'conversation.item.create',
        item: {
            type: 'function_call_output',
            call_id: callId,
            output,
        },
    }));
}

export function resetPlayback() {
    nextTime = 0;
}

export function playPcm16Base64(b64: string) {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const view = new DataView(bytes.buffer);
    const samples = Math.floor(bytes.byteLength / 2);
    const floats = new Float32Array(samples);
    for (let i = 0; i < samples; i++) floats[i] = view.getInt16(i * 2, true) / 32768;

    const ctx = audioCtx ?? (audioCtx = new AudioContext());
    void ctx.resume();
    const buffer = ctx.createBuffer(1, floats.length, 24000);
    buffer.copyToChannel(floats, 0);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    const start = Math.max(ctx.currentTime, nextTime);
    source.start(start);
    nextTime = start + buffer.duration;
}
