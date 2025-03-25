import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Лениво загружаемые компоненты
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const RoomsPage = lazy(() => import('./pages/RoomsPage'));
const RoomDetailPage = lazy(() => import('./pages/RoomDetailPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const BookingsPage = lazy(() => import('./pages/BookingsPage'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminRoomsPage = lazy(() => import('./pages/admin/RoomsPage'));
const AdminBookingsPage = lazy(() => import('./pages/admin/BookingsPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/UsersPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Компонент загрузки
const Loading = () => <div className="loading">Загрузка...</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:id" element={<RoomDetailPage />} />
            <Route path="/booking/:roomId?" element={<BookingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Защищенные маршруты для пользователей */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
            
            {/* Маршруты администратора */}
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/rooms" element={<ProtectedRoute adminOnly={true}><AdminRoomsPage /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute adminOnly={true}><AdminBookingsPage /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute adminOnly={true}><AdminUsersPage /></ProtectedRoute>} />
            
            {/* Обработка несуществующих маршрутов */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App; 