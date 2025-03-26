import React, { Component } from 'react';
import styled from 'styled-components';
import logger from '../utils/logger';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 800px;
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: var(--danger-color);
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
`;

const ErrorMessage = styled.p`
  color: var(--text-color);
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const ErrorStack = styled.pre`
  background-color: var(--light-color);
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: var(--radius-sm);
  width: 100%;
  overflow-x: auto;
  text-align: left;
  font-size: 0.85rem;
  color: var(--text-secondary);
  max-height: 300px;
  overflow-y: auto;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  margin: 0 0.5rem;

  &:hover {
    background-color: var(--primary-dark);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
`;

const CustomMessage = styled.div`
  padding: 1rem;
  margin-top: 1rem;
  border: 1px solid var(--light-color);
  border-radius: var(--radius-sm);
  background-color: var(--light-color);
  width: 100%;
`;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      componentPath: null,
      showDetails: false,
      customMessage: '',
    };
  }

  static getDerivedStateFromError(error) {
    // Обновляем состояние, чтобы следующий рендер показал запасной UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Определяем путь компонента, где произошла ошибка
    const componentStack = errorInfo.componentStack || '';
    const componentPath = componentStack
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.trim())
      .slice(0, 3)
      .join(' → ');

    // Сохраняем информацию в состоянии
    this.setState({
      error: error,
      errorInfo: errorInfo,
      componentPath,
    });

    // Подробное логирование ошибки
    logger.group('Ошибка рендеринга компонента', true);
    logger.error('Ошибка рендеринга:', error, errorInfo);

    // Логируем контекст ошибки
    logger.trace('Контекст ошибки:', {
      component: componentPath,
      url: window.location.href,
      userAgent: navigator.userAgent,
      time: new Date().toISOString(),
      // Добавляем сетевые запросы, если доступны
      networkRequests: performance
        ?.getEntries?.()
        ?.filter(e => e.entryType === 'resource')
        .slice(-10),
    });

    // Логируем состояние React-дерева
    if (this.props.routerProps) {
      logger.debug('Состояние маршрутизации:', this.props.routerProps);
    }

    logger.groupEnd();
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  handleDeveloperMode = () => {
    const errorInfo = {
      error: this.state.error?.toString(),
      componentStack: this.state.errorInfo?.componentStack,
      location: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      // Добавляем дополнительный контекст для отладки
      localStorage: Object.keys(localStorage),
      sessionStorage: Object.keys(sessionStorage),
      cookies: document.cookie,
      networkRequests: performance
        ?.getEntries?.()
        ?.filter(e => e.entryType === 'resource')
        .slice(-10),
    };

    // Загружаем ошибку в localStorage для отладки
    localStorage.setItem('errorDebugInfo', JSON.stringify(errorInfo, null, 2));
    logger.debug('Информация об ошибке сохранена в localStorage');

    this.setState({
      customMessage:
        'Отладочная информация сохранена в localStorage. Используйте localStorage.getItem("errorDebugInfo") в консоли для просмотра.',
    });
  };

  render() {
    const { showDetailsDefault = false } = this.props;
    const { showDetails = showDetailsDefault, componentPath, customMessage } = this.state;

    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Что-то пошло не так</ErrorTitle>
          <ErrorMessage>
            Произошла ошибка при отображении этого компонента.
            {componentPath && (
              <>
                <br />
                <strong>Место ошибки:</strong> {componentPath}
              </>
            )}
          </ErrorMessage>

          {(showDetails || process.env.NODE_ENV !== 'production') && this.state.error && (
            <>
              <ErrorStack>
                <strong>Ошибка:</strong> {this.state.error.toString()}
                {this.state.errorInfo && (
                  <>
                    <br />
                    <br />
                    <strong>Стек компонентов:</strong>
                    {this.state.errorInfo.componentStack}
                  </>
                )}
              </ErrorStack>
            </>
          )}

          {customMessage && <CustomMessage>{customMessage}</CustomMessage>}

          <ButtonGroup>
            <Button onClick={() => window.location.reload()}>Обновить страницу</Button>
            <Button onClick={() => (window.location.href = '/')}>На главную</Button>
            <Button onClick={this.toggleDetails}>
              {showDetails ? 'Скрыть детали' : 'Показать детали'}
            </Button>
            {process.env.NODE_ENV !== 'production' && (
              <Button onClick={this.handleDeveloperMode}>Режим разработчика</Button>
            )}
          </ButtonGroup>
        </ErrorContainer>
      );
    }

    // Если ошибки нет, рендерим детей
    return this.props.children;
  }
}

export default ErrorBoundary;
