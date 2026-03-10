import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { useChat } from '../../context/ChatContext';
import { Icon } from '../ui/Icon';
import '../../styles/chatbot.css';
import { useLocation } from 'react-router-dom';

export function GlobalChatOverlay() {
    const { isOpen, closeChat, messages, addMessage, toggleChat, model, setModel } = useChat();
    const [inputValue, setInputValue] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const isLandingPage = location.pathname === '/';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachment(e.target.files[0]);
        }
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() && !attachment) return;

        let attachmentData;
        if (attachment) {
            attachmentData = {
                name: attachment.name,
                url: URL.createObjectURL(attachment),
                type: attachment.type
            };
        }

        addMessage({
            text: inputValue,
            sender: 'user',
            ...(attachmentData && { attachment: attachmentData })
        });

        setInputValue('');
        setAttachment(null);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) + ':' + date.getSeconds().toString().padStart(2, '0');
    };

    return (
        <>
            <div className={`global-chatbot__overlay-container ${isOpen ? 'global-chatbot__overlay-container--open' : ''}`}>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className={`chatbot__window global-chatbot__window ${isLandingPage ? 'global-chatbot__window--landing' : ''}`}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <div className="chatbot__header">
                                <div className="chatbot__header-status">
                                    <span className="chatbot__status-dot"></span>
                                    <span>SYS_READY</span>
                                </div>
                                <div className="chatbot__header-model">
                                    <label className="chatbot__model-label">
                                        MODEL
                                        <select
                                            className="chatbot__model-select"
                                            value={model}
                                            onChange={(e) => setModel(e.target.value)}
                                        >
                                            <option value="default">Auto</option>
                                            <option value="gpt-4.1-mini">GPT-4.1 Mini</option>
                                            <option value="gpt-4.1">GPT-4.1</option>
                                            <option value="gemini-2.0-flash">Gemini Flash</option>
                                        </select>
                                    </label>
                                </div>
                                <button className="chatbot__close-btn" aria-label="Close chat window" onClick={closeChat}>
                                    <Icon name="x" size={16} />
                                </button>
                            </div>

                            <div className="chatbot__messages">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`chatbot__message-wrapper chatbot__message-wrapper--${msg.sender}`}>
                                        <div className="chatbot__message-meta">
                                            <span className="chatbot__message-sender">{msg.sender === 'ai' ? 'SYS' : 'USR'}</span>
                                            <span className="chatbot__message-time">{formatTime(msg.timestamp)}</span>
                                        </div>
                                        <div className={`chatbot__message chatbot__message--${msg.sender}`}>
                                            {msg.text && <div>{msg.text}</div>}
                                            {msg.attachment && (
                                                <div className="chatbot__message-attachment">
                                                    {msg.attachment.type.startsWith('image/') ? (
                                                        <img src={msg.attachment.url} alt={msg.attachment.name} className="chatbot__attachment-image" />
                                                    ) : msg.attachment.type.startsWith('video/') ? (
                                                        <video src={msg.attachment.url} controls className="chatbot__attachment-video" />
                                                    ) : (
                                                        <div className="chatbot__attachment-file">
                                                            <Icon name="paperclip" size={14} />
                                                            <span>{msg.attachment.name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="chatbot__input-container">
                                {attachment && (
                                    <div className="chatbot__attachment-preview">
                                        <div className="chatbot__attachment-preview-info">
                                            <Icon name="paperclip" size={14} />
                                            <span className="chatbot__attachment-name">{attachment.name}</span>
                                        </div>
                                        <button type="button" className="chatbot__attachment-remove" onClick={() => setAttachment(null)}>
                                            <Icon name="x" size={14} />
                                        </button>
                                    </div>
                                )}
                                <form className="chatbot__input-area" onSubmit={handleSend}>
                                    <span className="chatbot__input-prefix">&gt;</span>
                                    <input
                                        type="text"
                                        className="chatbot__input"
                                        placeholder="ENTER COMMAND..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        autoComplete="off"
                                    />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        accept=".pdf,.doc,.docx,image/*,video/*"
                                    />
                                    <button type="button" className="chatbot__attach-btn" aria-label="Attach file" onClick={() => fileInputRef.current?.click()}>
                                        <Icon name="paperclip" size={18} />
                                    </button>
                                    <button type="submit" className="chatbot__submit-btn" disabled={!inputValue.trim() && !attachment}>
                                        [ EXECUTE ]
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Floating Global Trigger Icon (only visible when NOT on landing page) */}
            {!isLandingPage && (
                <div
                    className="global-chatbot__floating-spline-trigger"
                    onClick={toggleChat}
                >
                    {/* Render the Spline scene globally as a persistent toggle icon */}
                    <Spline scene="https://prod.spline.design/brh4nk75sWlRfJme/scene.splinecode" />
                </div>
            )}
        </>
    );
}
