import Spline from '@splinetool/react-spline';
import { useChat } from '../../context/ChatContext';
import '../../styles/chatbot.css';

export function Chatbot() {
    const { isOpen, toggleChat } = useChat();

    return (
        <div className="chatbot__container">
            {/* The Spline acts purely as the interactive avatar/trigger inside the LandingPage */}
            <div
                className={`chatbot__avatar ${isOpen ? 'chatbot__avatar--active' : ''}`}
                onClick={toggleChat}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'pointer' }}   
            >
                <Spline
                    scene="https://prod.spline.design/brh4nk75sWlRfJme/scene.splinecode"
                    style={{ background: 'transparent' }}
                />
                <div className="chatbot__avatar-overlay">
                    {!isOpen && <span className="chatbot__avatar-hint">[ CLICK TO INITIALIZE ]</span>}
                </div>
            </div>
        </div>
    );
}
