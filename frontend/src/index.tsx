import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import { ErrorBoundary } from 'react-error-boundary';

// Компонент для отображения ошибок
const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => {
  return (
    <div className="error-container">
      <h2>Что-то пошло не так!</h2>
      <p>Произошла ошибка в приложении:</p>
      <pre>{error.message}</pre>
      <button 
        onClick={() => window.location.reload()}
        className="error-retry-button"
      >
        Перезагрузить приложение
      </button>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
); 