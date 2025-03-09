import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaSignInAlt, FaPlus } from 'react-icons/fa';

const Header: React.FC = () => {
  const location = useLocation();
  
  // Перевірка активного шляху для стилізації навігації
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-indigo-600 border-indigo-600' : 'text-gray-600 border-transparent hover:text-indigo-600 hover:border-indigo-600';
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <FaCalendarAlt className="text-indigo-600 text-2xl mr-2" />
              <span className="text-xl font-bold text-gray-800">
                Event<span className="text-indigo-600">Master</span>
              </span>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className={`py-2 border-b-2 transition-colors duration-200 ${isActive('/')}`}
            >
              Головна
            </Link>
            
            <Link
              to="/create-event"
              className={`flex items-center py-2 border-b-2 transition-colors duration-200 ${isActive('/create-event')}`}
            >
              <FaPlus className="mr-1" />
              Створити подію
            </Link>
            
            <Link
              to="/login"
              className={`flex items-center py-2 border-b-2 transition-colors duration-200 ${isActive('/login')}`}
            >
              <FaSignInAlt className="mr-1" />
              Увійти
            </Link>
            
            <Link
              to="/profile"
              className="ml-4 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors duration-200"
            >
              <FaUser />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 