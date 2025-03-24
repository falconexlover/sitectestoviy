import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Компонент для защиты маршрутов, требующих авторизации
 * 
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Дочерние элементы (защищаемый компонент)
 * @param {string} props.requiredRole - Требуемая роль для доступа к маршруту
 * @returns {React.ReactNode} - Защищенный компонент или редирект на страницу входа
 */
const PrivateRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  // Если идёт загрузка информации о пользователе, показываем загрузчик
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Загрузка...</p>
      </div>
    );
  }

  // Если пользователь не авторизован, перенаправляем на страницу логина
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если требуется определенная роль и у пользователя её нет, перенаправляем на главную страницу
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Если всё в порядке, показываем защищённый контент
  return children;
};

export default PrivateRoute; 