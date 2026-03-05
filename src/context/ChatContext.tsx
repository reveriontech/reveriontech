import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

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
}

interface ChatContextType {
    isOpen: boolean;
    toggleChat: () => void;
    openChat: () => void;
    closeChat: () => void;
    model: string;
    setModel: (model: string) => void;
    messages: ChatMessage[];
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
    messageCount: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messageCount, setMessageCount] = useState(0);
    const [model, setModel] = useState<string>('default');
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', text: 'SYSTEM INITIALIZED.', sender: 'ai', timestamp: new Date() },
        { id: '2', text: 'Awaiting input...', sender: 'ai', timestamp: new Date() }
    ]);

    const toggleChat = () => setIsOpen((prev) => !prev);
    const openChat = () => setIsOpen(true);
    const closeChat = () => setIsOpen(false);

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
            setMessageCount(prev => prev + 1);
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

            try {
                const parts: any[] = [];

                // Base64 encode attachments
                if (message.attachment) {
                    try {
                        const response = await fetch(message.attachment.url);
                        const blob = await response.blob();
                        const base64 = await new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const result = reader.result as string;
                                resolve(result.split(',')[1]);
                            };
                            reader.readAsDataURL(blob);
                        });

                        parts.push({
                            inlineData: { data: base64, mimeType: message.attachment.type }
                        });
                    } catch (attachErr) {
                        console.error("Failed to process attachment:", attachErr);
                    }
                }

                if (message.text) {
                    parts.push({ text: message.text });
                } else if (message.attachment) {
                    parts.push({ text: "Please describe this file." });
                }

                // Send request to Rust backend
                const response = await fetch('http://localhost:8080/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model,
                        messages: [
                            { role: "user", parts }
                        ]
                    })
                });

                if (!response.ok) {
                    throw new Error(`Backend error: ${response.status}`);
                }

                const result = await response.json();

                // Update the typing message with the actual response
                setMessages((prev) =>
                    prev.map(msg => msg.id === typingId
                        ? { ...msg, text: result.text || 'NO DATALINK.' }
                        : msg)
                );

            } catch (error) {
                console.error("Rust Backend RAG Error:", error);
                // Update the typing message with the error
                setMessages((prev) =>
                    prev.map(msg => msg.id === typingId
                        ? { ...msg, text: "ERROR: Failed to reach RAG Subsystem." }
                        : msg)
                );
            }
        }
    };

    return (
        <ChatContext.Provider
            value={{ isOpen, toggleChat, openChat, closeChat, model, setModel, messages, addMessage, messageCount }}
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
