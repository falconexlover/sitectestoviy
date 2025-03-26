import React, { useEffect, useState } from 'react';
import HomePage from './HomePage';
import logger from '../utils/logger';
import { withComponentTracking, usePerfTracking, useStateTracking } from '../utils/debugUtils';

/**
 * Обертка для HomePage с подробным логированием
 */
const HomePageDebug = () => {
  const [error, setError] = useState(null);
  const [isRendered, setIsRendered] = useState(false);
  const [componentTree, setComponentTree] = useState([]);

  // Отслеживаем состояние
  useStateTracking('HomePageDebug', { error, isRendered });

  // Измеряем производительность
  usePerfTracking('HomePageDebug', [error, isRendered]);

  // Первоначальная загрузка компонента
  useEffect(() => {
    logger.group('HomePageDebug инициализация', true);
    logger.trace('Запуск рендеринга HomePage с отладкой');

    // Устанавливаем обработчик ошибок
    const originalError = console.error;
    console.error = (...args) => {
      logger.error('Перехвачена ошибка в консоли:', args);
      setError({ message: args.join(' '), time: Date.now() });
      originalError.apply(console, args);
    };

    // Отслеживаем рендеринг React-компонентов
    const originalCreateElement = React.createElement;
    React.createElement = function debugCreateElement(type, props, ...children) {
      if (typeof type === 'function' || typeof type === 'object') {
        const componentName = type.displayName || type.name || 'Unknown';

        if (!componentTree.includes(componentName)) {
          setComponentTree(prev => [...prev, componentName]);
          logger.trace(`Рендеринг компонента: ${componentName}`);
        }
      }
      return originalCreateElement.apply(React, [type, props, ...children]);
    };

    // Восстанавливаем оригинальные функции при размонтировании
    return () => {
      console.error = originalError;
      React.createElement = originalCreateElement;
      logger.groupEnd();
    };
  }, [componentTree, setComponentTree]);

  // Логируем ошибки при их появлении
  useEffect(() => {
    if (error) {
      logger.group('Ошибка рендеринга HomePage', true);
      logger.error('Ошибка:', error);
      logger.error('Дерево компонентов:', componentTree);
      logger.groupEnd();
    }
  }, [error, componentTree]);

  // Отмечаем успешный рендеринг
  const handleRenderSuccess = () => {
    logger.debug('Рендеринг HomePage завершен успешно');
    setIsRendered(true);
  };

  const handleRenderError = err => {
    logger.error('Ошибка при рендеринге HomePage:', err);
    setError(err);
  };

  return (
    <ErrorBoundaryWrapper onError={handleRenderError}>
      <div onLoad={handleRenderSuccess}>
        {error ? (
          <div className="error-placeholder">
            <h2>Ошибка при загрузке главной страницы</h2>
            <p>{error.message}</p>
            <button onClick={() => window.location.reload()}>Попробовать снова</button>
          </div>
        ) : (
          <HomePage />
        )}
      </div>
    </ErrorBoundaryWrapper>
  );
};

// Дополнительная обертка для ErrorBoundary
class ErrorBoundaryWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logger.error('Ошибка рендеринга в ErrorBoundaryWrapper:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-wrapper">
          <h3>Произошла ошибка при отображении компонента</h3>
          <p>{this.state.error.toString()}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Попробовать снова
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Применяем HOC для отслеживания компонента
export default withComponentTracking(HomePageDebug);
