import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <FaExclamationTriangle className="text-yellow-500 text-7xl mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-gray-800">404 - Сторінку не знайдено</h1>
        <p className="text-xl text-gray-600 mb-8">
          Сторінка, яку ви шукаєте, не існує або була переміщена.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-200"
        >
          <FaHome className="mr-2" />
          Повернутися на головну
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 