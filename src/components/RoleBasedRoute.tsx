import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';

type RoleBasedRouteProps = {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
};

/**
 * Компонент для захисту маршрутів на основі ролей користувача
 * Може вимагати конкретну роль або просто автентифікацію
 */
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/auth'
}) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  
  // Показуємо loader поки перевіряємо авторизацію
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // Перевіряємо авторизацію
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Якщо потрібна певна роль, перевіряємо її
  if (requiredRole) {
    const hasRequiredRole = 
      requiredRole === UserRole.ADMIN ? userRole === UserRole.ADMIN :
      requiredRole === UserRole.MODERATOR ? 
        (userRole === UserRole.MODERATOR || userRole === UserRole.ADMIN) : 
        true;
        
    if (!hasRequiredRole) {
      // Якщо немає потрібної ролі, перенаправляємо на домашню сторінку
      return <Navigate to="/" replace />;
    }
  }
  
  // Якщо все гаразд, показуємо дочірні компоненти
  return <>{children}</>;
};

export default RoleBasedRoute; 