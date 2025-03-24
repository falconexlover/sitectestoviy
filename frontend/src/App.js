import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Импорт компонентов страниц
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import ProfilePage from './pages/ProfilePage';
// import BookingsPage from './pages/BookingsPage';
// import BookingDetailPage from './pages/BookingDetailPage';
// import AdminDashboardPage from './pages/admin/DashboardPage';
// import AdminRoomsPage from './pages/admin/RoomsPage';
// import AdminBookingsPage from './pages/admin/BookingsPage';
// import AdminCustomersPage from './pages/admin/CustomersPage';
// import AdminCustomerDetailPage from './pages/admin/CustomerDetailPage';
// import AdminAnalyticsPage from './pages/admin/AnalyticsPage';
// import NotFoundPage from './pages/NotFoundPage';

// Временная страница-заглушка
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>{title || 'Страница в разработке'}</h1>
    <p>Эта страница еще не реализована. Скоро она будет доступна!</p>
    <a href="/" style={{ display: 'inline-block', margin: '1rem 0', padding: '0.5rem 1rem', backgroundColor: '#003366', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
      Вернуться на главную
    </a>
  </div>
);

// Защищенный маршрут для аутентифицированных пользователей
const PrivateRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  useEffect(() => {
    // Проверочный запрос к API
    fetch('http://localhost:5000/api/rooms')
      .then(response => response.json())
      .then(data => {
        console.log('API response:', data);
      })
      .catch(error => {
        console.error('API error:', error);
      });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Публичные страницы */}
            <Route index element={<HomePage />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="rooms/:id" element={<RoomDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Защищенные страницы для аутентифицированных пользователей */}
            <Route path="profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
            <Route path="bookings" element={
              <PrivateRoute>
                <PlaceholderPage title="Мои бронирования" />
              </PrivateRoute>
            } />
            <Route path="bookings/:id" element={
              <PrivateRoute>
                <PlaceholderPage title="Детали бронирования" />
              </PrivateRoute>
            } />

            {/* Административные страницы */}
            <Route path="admin/dashboard" element={
              <PrivateRoute roles={['admin', 'manager']}>
                <PlaceholderPage title="Панель администратора" />
              </PrivateRoute>
            } />
            <Route path="admin/rooms" element={
              <PrivateRoute roles={['admin', 'manager']}>
                <PlaceholderPage title="Управление номерами" />
              </PrivateRoute>
            } />
            <Route path="admin/bookings" element={
              <PrivateRoute roles={['admin', 'manager']}>
                <PlaceholderPage title="Управление бронированиями" />
              </PrivateRoute>
            } />
            <Route path="admin/customers" element={
              <PrivateRoute roles={['admin', 'manager']}>
                <PlaceholderPage title="Управление клиентами" />
              </PrivateRoute>
            } />
            <Route path="admin/customers/:id" element={
              <PrivateRoute roles={['admin', 'manager']}>
                <PlaceholderPage title="Информация о клиенте" />
              </PrivateRoute>
            } />
            <Route path="admin/analytics" element={
              <PrivateRoute roles={['admin', 'manager']}>
                <PlaceholderPage title="Аналитика" />
              </PrivateRoute>
            } />

            {/* Страница 404 */}
            <Route path="*" element={<PlaceholderPage title="Страница не найдена" />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 