import type { ReactElement } from 'react';
import type { FallbackProps } from 'react-error-boundary';

// Loading fallback component
export interface LoadingFallbackProps {
    message?: string;
}

export const LoadingFallback = ({ message = 'Loading...' }: LoadingFallbackProps): ReactElement => (
    <div className="lazy-loading-container">
        <div className="spinner"></div>
        <p>{message}</p>
    </div>
);

// Error fallback component - uses FallbackProps from react-error-boundary
export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps): ReactElement => {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return (
        <div className="lazy-error-container">
            <h2>Something went wrong</h2>
            <p>{errorMessage}</p>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    );
};
