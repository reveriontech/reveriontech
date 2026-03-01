import { useState, useRef, type ReactNode } from 'react';
import './PinContainer.css';

interface PinContainerProps {
    children: ReactNode;
    title: string;
    href?: string;
    className?: string;
    containerClassName?: string;
    onClick?: () => void;
}

export function PinContainer({
    children,
    title,
    href,
    className = '',
    containerClassName = '',
    onClick,
}: PinContainerProps) {
    const [transform, setTransform] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = (-y / (rect.height / 2)) * 12;
        const rotateY = (x / (rect.width / 2)) * 12;
        setTransform(
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.035, 1.035, 1.035)`
        );
    };

    const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    };

    return (
        <div
            className={`pin-scene ${containerClassName}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            ref={ref}
        >
            {/* 3D tilt card */}
            <div className="pin-card" style={{ transform }}>
                {/* Pin needle */}
                <div className="pin-needle">
                    <div className="pin-needle__line" />
                    {href ? (
                        <a
                            className="pin-needle__head"
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className="pin-needle__text">{title}</span>
                        </a>
                    ) : (
                        <div className="pin-needle__head">
                            <span className="pin-needle__text">{title}</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className={`pin-content ${className}`}>{children}</div>
            </div>
        </div>
    );
}
