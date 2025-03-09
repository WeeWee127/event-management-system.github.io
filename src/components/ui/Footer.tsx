import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EventMaster</h3>
            <p className="text-gray-300">
              Платформа для створення та управління подіями будь-якого масштабу.
              Знаходьте цікаві події, реєструйтеся та створюйте власні.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Швидкі посилання</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-indigo-400 transition-colors">
                  Головна
                </Link>
              </li>
              <li>
                <Link to="/create-event" className="text-gray-300 hover:text-indigo-400 transition-colors">
                  Створити подію
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-indigo-400 transition-colors">
                  Увійти
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-indigo-400 transition-colors">
                  Зареєструватися
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Приєднуйтесь до нас</h3>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaGithub size={24} />
              </a>
              <a 
                href="https://instagram.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-400 transition-colors"
              >
                <FaInstagram size={24} />
              </a>
              <a 
                href="https://facebook.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                <FaFacebook size={24} />
              </a>
              <a 
                href="https://twitter.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-300 transition-colors"
              >
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} EventMaster. Усі права захищено.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 