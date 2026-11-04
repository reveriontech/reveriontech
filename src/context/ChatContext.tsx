import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { onXaiEvent, playPcm16Base64, resetPlayback, sendFunctionOutput, sendUserTurn, startVoiceCall, stopVoiceCall } from '../lib/xaiRealtime';
import { whatsappLink } from '../data/site';

export interface ChatAttachment {
    name: string;
    url: string;
    type: string;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'ai' | 'user';
    timestamp: Date;
    attachment?: ChatAttachment;
    link?: string;
}

interface ChatContextType {
    isOpen: boolean;
    toggleChat: () => void;
    openChat: () => void;
    closeChat: () => void;
    messages: ChatMessage[];
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
    messageCount: number;
    callActive: boolean;
    startCall: () => Promise<void>;
    endCall: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messageCount, setMessageCount] = useState(0);
    const [callActive, setCallActive] = useState(false);
    const messageCountRef = useRef(0);
    const replyId = useRef<string | null>(null);
    const voiceUserId = useRef<string | null>(null);
    const onCall = useRef(false);
    const handoff = useRef(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', text: 'SYSTEM INITIALIZED.', sender: 'ai', timestamp: new Date() },
        { id: '2', text: 'Awaiting input...', sender: 'ai', timestamp: new Date() }
    ]);

    const endCall = () => {
        onCall.current = false;
        setCallActive(false);
        stopVoiceCall();
    };
    const toggleChat = () => setIsOpen((prev) => !prev);
    const openChat = () => setIsOpen(true);
    const closeChat = () => {
        if (onCall.current) endCall();
        setIsOpen(false);
    };

    const startCall = async () => {
        if (messageCount >= 5) {
            setMessages((prev) => [...prev, {
                id: Date.now().toString(),
                text: 'RATE LIMIT EXCEEDED. MAXIMUM OF 5 QUERIES ALLOWED.',
                sender: 'ai',
                timestamp: new Date(),
            }]);
            return;
        }
        onCall.current = true;
        setCallActive(true);
        try {
            await startVoiceCall();
        } catch (error) {
            console.error('Voice call error:', error);
            onCall.current = false;
            setCallActive(false);
            stopVoiceCall();
            const denied = error instanceof DOMException && (error.name === 'NotAllowedError' || error.name === 'NotFoundError');
            setMessages((prev) => [...prev, {
                id: Date.now().toString(),
                text: denied ? 'MICROPHONE ACCESS DENIED.' : 'ERROR: Voice call failed.',
                sender: 'ai',
                timestamp: new Date(),
            }]);
        }
    };

    useEffect(() => onXaiEvent((event) => {
        if (event.type === 'proxy.close' && onCall.current) {
            onCall.current = false;
            setCallActive(false);
        }

        if (event.type === 'input_audio_buffer.speech_started' && onCall.current) {
            resetPlayback();
            if (messageCountRef.current >= 5) {
                endCall();
                setMessages((prev) => [...prev, {
                    id: Date.now().toString(),
                    text: 'RATE LIMIT EXCEEDED. MAXIMUM OF 5 QUERIES ALLOWED.',
                    sender: 'ai',
                    timestamp: new Date(),
                }]);
                return;
            }
            const userId = `voice-${Date.now()}`;
            voiceUserId.current = userId;
            messageCountRef.current += 1;
            setMessageCount(messageCountRef.current);
            setMessages((prev) => [...prev, {
                id: userId, text: '...', sender: 'user', timestamp: new Date(),
            }]);
            return;
        }

        if (
            (event.type === 'conversation.item.input_audio_transcription.completed'
                || event.type === 'conversation.item.input_audio_transcription.updated')
            && typeof event.transcript === 'string'
            && voiceUserId.current
        ) {
            const userId = voiceUserId.current;
            const transcript = event.transcript;
            setMessages((prev) => prev.map((msg) => msg.id === userId ? { ...msg, text: transcript || msg.text } : msg));
            return;
        }

        if (event.type === 'response.created' && onCall.current && !replyId.current) {
            const typingId = `reply-${Date.now()}`;
            replyId.current = typingId;
            setMessages((prev) => [...prev, {
                id: typingId, text: '', sender: 'ai', timestamp: new Date(),
            }]);
        }

        const id = replyId.current;
        if (!id) return;

        if (event.type === 'response.created') {
            resetPlayback();
            const activeId = replyId.current;
            if (activeId) {
                setMessages((prev) => prev.map((msg) => (
                    msg.id === activeId && msg.link ? { ...msg, text: '' } : msg
                )));
            }
            return;
        }

        if (event.type === 'response.function_call_arguments.done' && event.name === 'transfer_call') {
            const url = whatsappLink('Hi, I was just speaking with the Reverion Tech assistant and would like to continue with the team.');
            if (url) window.open(url, '_blank', 'noopener,noreferrer');
            handoff.current = true;
            if (id) {
                setMessages((prev) => prev.map((msg) => (
                    msg.id === id
                        ? {
                            ...msg,
                            text: url
                                ? 'Connecting you with the team on WhatsApp.'
                                : 'WhatsApp transfer is not configured.',
                            link: url,
                        }
                        : msg
                )));
            }
            const callId = typeof event.call_id === 'string' ? event.call_id : '';
            if (callId) {
                sendFunctionOutput(
                    callId,
                    url
                        ? 'The visitor is being handed off on WhatsApp. Say one short sentence that WhatsApp is opening.'
                        : 'WhatsApp handoff failed because no number is configured. Apologize briefly.',
                );
            }
            return;
        }

        if (event.type === 'response.output_audio_transcript.delta') {
            const delta = String(event.delta ?? '');
            setMessages((prev) => prev.map((msg) => {
                if (msg.id !== id) return msg;
                const base = msg.text === 'PROCESSING REQUEST...' ? '' : msg.text;
                return { ...msg, text: base + delta };
            }));
            return;
        }

        if (event.type === 'response.output_audio.delta' && typeof event.delta === 'string') {
            playPcm16Base64(event.delta);
            return;
        }

        if (event.type === 'response.output_audio_transcript.done' && typeof event.transcript === 'string' && event.transcript) {
            const transcript = event.transcript;
            setMessages((prev) => prev.map((msg) => msg.id === id ? { ...msg, text: transcript } : msg));
            return;
        }

        if (event.type === 'response.done') {
            if (handoff.current) {
                handoff.current = false;
                replyId.current = null;
                return;
            }
            setMessages((prev) => prev.map((msg) => (
                msg.id === id && (msg.text === 'PROCESSING REQUEST...' || msg.text === '')
                    ? { ...msg, text: 'NO DATALINK.' }
                    : msg
            )));
            replyId.current = null;
            return;
        }

        if (event.type === 'error' || event.type === 'proxy.close') {
            setMessages((prev) => prev.map((msg) => (
                msg.id === id && (msg.text === 'PROCESSING REQUEST...' || msg.text === '')
                    ? { ...msg, text: 'ERROR: Failed to reach assistant.' }
                    : msg
            )));
            replyId.current = null;
        }
    }), []);

    const addMessage = async (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        if (message.sender === 'user') {
            if (messageCount >= 5) {
                setMessages((prev) => [...prev, {
                    id: Date.now().toString(),
                    text: 'RATE LIMIT EXCEEDED. MAXIMUM OF 5 QUERIES ALLOWED.',
                    sender: 'ai',
                    timestamp: new Date()
                }]);
                return;
            }
            messageCountRef.current += 1;
            setMessageCount(messageCountRef.current);
        }

        const newMsg: ChatMessage = {
            ...message,
            id: Date.now().toString(),
            timestamp: new Date()
        };

        setMessages((prev) => [...prev, newMsg]);

        if (message.sender === 'user') {
            const typingId = (Date.now() + 1).toString();
            setMessages((prev) => [...prev, {
                id: typingId, text: 'PROCESSING REQUEST...', sender: 'ai', timestamp: new Date()
            }]);

            const text = message.text.trim()
                || (message.attachment ? `User attached ${message.attachment.name}` : '');

            try {
                await sendUserTurn(text, () => {
                    replyId.current = typingId;
                });
            } catch (error) {
                console.error('xAI realtime error:', error);
                replyId.current = null;
                setMessages((prev) =>
                    prev.map(msg => msg.id === typingId
                        ? { ...msg, text: 'ERROR: Failed to reach assistant.' }
                        : msg)
                );
            }
        }
    };

    return (
        <ChatContext.Provider
            value={{ isOpen, toggleChat, openChat, closeChat, messages, addMessage, messageCount, callActive, startCall, endCall }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
