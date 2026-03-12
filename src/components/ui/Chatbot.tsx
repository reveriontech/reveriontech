import { useState, type FormEvent } from 'react';

interface ChatMessage {
  id: number;
  from: 'user' | 'bot';
  text: string;
}

interface ChatbotProps {
  onClose?: () => void;
}

export function Chatbot({ onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      from: 'bot',
      text: "Hi, I'm the ReverionTech assistant. Ask me anything about Web3, GenAI, or working with our team.",
    },
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      from: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Placeholder echo response – replace with backend integration later.
    const reply: ChatMessage = {
      id: Date.now() + 1,
      from: 'bot',
      text: "Thanks for your message. This demo chatbot is UI-only right now – we'll hook it to your backend or an AI API next.",
    };
    setMessages((prev) => [...prev, reply]);
  };

  return (
    <div className="chatbot">
      <div className="chatbot__header">
        <div>
          <p className="chatbot__title">ReverionTech Copilot</p>
          <p className="chatbot__subtitle">Ask product or tech questions in real time.</p>
        </div>
        {onClose && (
          <button type="button" className="chatbot__close" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <div className="chatbot__messages" aria-live="polite">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`chatbot__message chatbot__message--${m.from}`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <form className="chatbot__form" onSubmit={handleSubmit}>
        <input
          className="chatbot__input"
          placeholder="Type your question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="chatbot__send" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

