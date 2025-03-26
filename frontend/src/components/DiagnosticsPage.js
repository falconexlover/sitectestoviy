import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import logger from '../utils/logger';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DebugPanel } from '../utils/debugUtils';

const DiagnosticsContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: 'Playfair Display', serif;
  margin-bottom: 2rem;
  text-align: center;
`;

const Card = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatusIndicator = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 0.5rem;
  background-color: ${props =>
    props.status === 'success'
      ? 'var(--success-color)'
      : props.status === 'warning'
        ? 'var(--warning-color)'
        : props.status === 'error'
          ? 'var(--danger-color)'
          : 'var(--text-secondary)'};
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:disabled {
    background-color: var(--text-secondary);
    cursor: not-allowed;
  }
`;

const CodeBlock = styled.pre`
  background-color: var(--light-color);
  padding: 1rem;
  border-radius: var(--radius-sm);
  overflow-x: auto;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const TestResult = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: ${props =>
    props.status === 'success'
      ? 'rgba(25, 135, 84, 0.1)'
      : props.status === 'warning'
        ? 'rgba(255, 193, 7, 0.1)'
        : props.status === 'error'
          ? 'rgba(220, 53, 69, 0.1)'
          : 'transparent'};
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
`;

const DiagnosticsPage = () => {
  const [apiStatus, setApiStatus] = useState('pending');
  const [authStatus, setAuthStatus] = useState('pending');
  const [envInfo, setEnvInfo] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const getEnvInfo = async () => {
      const info = {
        nodeEnv: process.env.NODE_ENV,
        apiUrl: process.env.REACT_APP_API_URL,
        appVersion: process.env.REACT_APP_VERSION || 'не указана',
        browserInfo: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        localStorage: !!window.localStorage,
        sessionStorage: !!window.sessionStorage,
      };

      setEnvInfo(info);
      logger.debug('Информация о среде загружена', info);
    };

    getEnvInfo();

    // Проверка статуса API
    checkApiStatus();

    // Проверка аутентификации
    if (isAuthenticated) {
      setAuthStatus('success');
    } else if (localStorage.getItem('token')) {
      setAuthStatus('warning');
    } else {
      setAuthStatus('neutral');
    }
  }, [isAuthenticated]);

  const checkApiStatus = async () => {
    try {
      setApiStatus('pending');
      const startTime = performance.now();

      const response = await fetch(`${process.env.REACT_APP_API_URL}/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      const duration = performance.now() - startTime;

      if (response.ok) {
        setApiStatus('success');
        logger.info(`API доступен, время ответа: ${Math.round(duration)}ms`);
      } else {
        setApiStatus('warning');
        logger.warn(`API отвечает с ошибкой: ${response.status}`);
      }
    } catch (error) {
      setApiStatus('error');
      logger.error('API недоступен:', error);
    }
  };

  const runTest = async (testName, testFn) => {
    try {
      setIsLoading(true);
      setTestResults(prev => ({
        ...prev,
        [testName]: { status: 'pending', message: 'Выполняется...' },
      }));

      // Запускаем тест
      const startTime = performance.now();
      const result = await testFn();
      const duration = performance.now() - startTime;

      setTestResults(prev => ({
        ...prev,
        [testName]: {
          status: 'success',
          message: `Успешно (${Math.round(duration)}ms)`,
          data: result,
        },
      }));

      logger.debug(`Тест "${testName}" выполнен успешно за ${Math.round(duration)}ms`, result);
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          status: 'error',
          message: error.message || 'Ошибка выполнения теста',
          error: error,
        },
      }));

      logger.error(`Тест "${testName}" завершился с ошибкой:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Тест API-запросов
  const testApiEndpoints = async () => {
    // Тестируем базовые эндпоинты
    const endpoints = [
      { url: '/rooms', method: 'GET', name: 'Получение списка номеров' },
      { url: '/health', method: 'GET', name: 'Проверка статуса сервера' },
    ];

    const results = {};

    for (const endpoint of endpoints) {
      try {
        const startTime = performance.now();
        const response = await api.request({
          url: endpoint.url,
          method: endpoint.method,
        });
        const duration = performance.now() - startTime;

        results[endpoint.name] = {
          status: response.status,
          duration: Math.round(duration),
          success: true,
        };
      } catch (error) {
        results[endpoint.name] = {
          status: error.response?.status || 0,
          error: error.message,
          success: false,
        };
      }
    }

    return results;
  };

  // Тест конфигурации
  const testEnvironmentConfig = async () => {
    // Проверяем наличие всех необходимых переменных окружения
    const requiredVars = ['REACT_APP_API_URL'];

    const missingVars = [];
    const config = {};

    for (const varName of requiredVars) {
      const value = process.env[varName];
      config[varName] = value;

      if (!value) {
        missingVars.push(varName);
      }
    }

    if (missingVars.length > 0) {
      throw new Error(`Отсутствуют переменные окружения: ${missingVars.join(', ')}`);
    }

    return config;
  };

  // Тест подключения к бэкенду по разным адресам
  const testConnectionVariants = async () => {
    const variants = [
      { url: `http://localhost:5000/api/v1/health`, name: 'API V1' },
      { url: `http://localhost:5000/api/health`, name: 'API (без версии)' },
      { url: `http://localhost:5000/health`, name: 'Корневой путь' },
    ];

    const results = {};

    for (const variant of variants) {
      try {
        const response = await fetch(variant.url, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        results[variant.name] = {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
        };
      } catch (error) {
        results[variant.name] = {
          error: error.message,
          ok: false,
        };
      }
    }

    return results;
  };

  // Тест локального хранилища
  const testLocalStorage = async () => {
    const testKey = `test_${Date.now()}`;
    const testValue = { time: Date.now(), test: true };

    // Сохраняем значение
    localStorage.setItem(testKey, JSON.stringify(testValue));

    // Читаем значение
    const retrieved = JSON.parse(localStorage.getItem(testKey));

    // Удаляем тестовое значение
    localStorage.removeItem(testKey);

    if (!retrieved || retrieved.time !== testValue.time) {
      throw new Error('Ошибка чтения/записи localStorage');
    }

    return {
      success: true,
      keysCount: Object.keys(localStorage).length,
    };
  };

  return (
    <DiagnosticsContainer>
      <Title>Диагностика системы</Title>

      <Grid>
        <Card>
          <CardTitle>Статус API</CardTitle>
          <p>
            <StatusIndicator status={apiStatus} />
            {apiStatus === 'success'
              ? 'API доступно'
              : apiStatus === 'warning'
                ? 'API отвечает с ошибками'
                : apiStatus === 'error'
                  ? 'API недоступно'
                  : 'Проверка статуса...'}
          </p>
          <p>URL: {process.env.REACT_APP_API_URL}</p>
          <Button onClick={checkApiStatus} disabled={isLoading}>
            Проверить
          </Button>
        </Card>

        <Card>
          <CardTitle>Статус аутентификации</CardTitle>
          <p>
            <StatusIndicator status={authStatus} />
            {authStatus === 'success'
              ? 'Пользователь аутентифицирован'
              : authStatus === 'warning'
                ? 'Токен есть, но сессия не подтверждена'
                : 'Пользователь не аутентифицирован'}
          </p>
          {isAuthenticated && user && <p>Пользователь: {user.email}</p>}
        </Card>

        <Card>
          <CardTitle>Информация о среде</CardTitle>
          {envInfo && (
            <>
              <p>Режим: {envInfo.nodeEnv}</p>
              <p>API URL: {envInfo.apiUrl}</p>
              <p>Браузер: {envInfo.browserInfo}</p>
              <p>Экран: {envInfo.screenSize}</p>
              <p>Часовой пояс: {envInfo.timeZone}</p>
              <p>Язык: {envInfo.language}</p>
            </>
          )}
        </Card>
      </Grid>

      <Card>
        <CardTitle>Тесты</CardTitle>

        <Button onClick={() => runTest('api-endpoints', testApiEndpoints)} disabled={isLoading}>
          Проверить API
        </Button>

        <Button onClick={() => runTest('environment', testEnvironmentConfig)} disabled={isLoading}>
          Проверить конфигурацию
        </Button>

        <Button onClick={() => runTest('localStorage', testLocalStorage)} disabled={isLoading}>
          Проверить хранилище
        </Button>

        <Button
          onClick={() => runTest('connection-variants', testConnectionVariants)}
          disabled={isLoading}
        >
          Тест вариантов URL
        </Button>

        {Object.entries(testResults).map(([testName, result]) => (
          <TestResult key={testName} status={result.status}>
            <strong>{testName}:</strong> {result.message}
            {result.data && <CodeBlock>{JSON.stringify(result.data, null, 2)}</CodeBlock>}
          </TestResult>
        ))}
      </Card>

      {/* Отладочная панель с кнопками для тестирования */}
      <DebugPanel visible={true} />
    </DiagnosticsContainer>
  );
};

export default DiagnosticsPage;
