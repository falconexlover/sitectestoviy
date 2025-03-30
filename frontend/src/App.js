import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
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

function App() {
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
          </Layout>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
