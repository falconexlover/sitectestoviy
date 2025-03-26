import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import HomePageDebug from './pages/HomePageDebug';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import BookingPage from './pages/BookingPage';
import BookingDetailPage from './pages/BookingDetailPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import ServicePage from './pages/ServicePage';
import NotFoundPage from './pages/NotFoundPage';
import Dashboard from './pages/admin/Dashboard';
import UsersPage from './pages/admin/UsersPage';
import DiagnosticsPage from './components/DiagnosticsPage';
import logger from './utils/logger';
import debugUtils, { DebugPanel } from './utils/debugUtils';

// Инициализация логгера при запуске приложения
logger.info('Приложение запущено в режиме:', process.env.NODE_ENV);
logger.debug('API URL:', process.env.REACT_APP_API_URL);

function App() {
  // Инициализация отладчиков
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logger.group('Инициализация отладочных инструментов', true);
      debugUtils.setupDebugListeners();

      // Собираем и логируем информацию о среде
      const envInfo = debugUtils.getEnvironmentInfo();
      logger.debug('Информация о среде:', envInfo);

      // Проверка соединения с API
      fetch(`${process.env.REACT_APP_API_URL}/health`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          logger.info('Соединение с API установлено:', data);
        })
        .catch(error => {
          logger.error('Ошибка соединения с API:', error);
          // Показываем уведомление об ошибке только в режиме разработки
          if (process.env.NODE_ENV === 'development') {
            console.error('Ошибка соединения с API. Убедитесь, что бэкенд запущен и доступен.');
          }
        });

      logger.groupEnd();
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={
                  <ErrorBoundary>
                    <HomePage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/debug"
                element={
                  <ErrorBoundary showDetails={true}>
                    <HomePageDebug />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/rooms"
                element={
                  <ErrorBoundary>
                    <RoomsPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/rooms/:id"
                element={
                  <ErrorBoundary>
                    <RoomDetailPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/booking/:roomId"
                element={
                  <ErrorBoundary>
                    <BookingPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/bookings"
                element={
                  <ErrorBoundary>
                    <BookingsPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/bookings/:id"
                element={
                  <ErrorBoundary>
                    <BookingDetailPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <ProfilePage />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <ErrorBoundary>
                    <LoginPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/register"
                element={
                  <ErrorBoundary>
                    <RegisterPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/contact"
                element={
                  <ErrorBoundary>
                    <ContactPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/about"
                element={
                  <ErrorBoundary>
                    <AboutPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/gallery"
                element={
                  <ErrorBoundary>
                    <GalleryPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/services"
                element={
                  <ErrorBoundary>
                    <ServicePage />
                  </ErrorBoundary>
                }
              />

              {/* Страница диагностики (только в development) */}
              <Route
                path="/diagnostics"
                element={
                  <ErrorBoundary showDetails={true}>
                    <DiagnosticsPage />
                  </ErrorBoundary>
                }
              />

              {/* Административные маршруты */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <ErrorBoundary>
                      <Dashboard />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <ErrorBoundary>
                      <UsersPage />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />

              <Route
                path="*"
                element={
                  <ErrorBoundary>
                    <NotFoundPage />
                  </ErrorBoundary>
                }
              />
            </Routes>
            {/* Отладочная панель (отображается только в режиме разработки) */}
            {process.env.NODE_ENV === 'development' && <DebugPanel />}
          </Layout>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
