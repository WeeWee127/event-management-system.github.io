import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import CreateEvent from './components/CreateEvent';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import Register from './components/Register';
import NotFound from './components/NotFound';
import { checkSupabaseConnection } from './lib/supabase';

// Components and Pages
import Layout from './components/Layout';
import Auth from './components/Auth';
import HomePage from './pages/HomePage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import MyEventsPage from './pages/MyEventsPage';
import DocumentationPage from './pages/DocumentationPage';
import AdminPage from './pages/AdminPage';
import RegisterForm from './components/RegisterForm';

function App() {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Перевірка з'єднання з Supabase при завантаженні додатка
    const checkConnection = async () => {
      try {
        const isConnected = await checkSupabaseConnection();
        setIsSupabaseConnected(isConnected);
        if (!isConnected) {
          setConnectionError('Не вдалося з\'єднатися з базою даних. Будь ласка, спробуйте пізніше.');
        }
      } catch (error) {
        console.error('Помилка перевірки з\'єднання з Supabase:', error);
        setIsSupabaseConnected(false);
        setConnectionError('Виникла помилка при з\'єднанні з базою даних. Спробуйте оновити сторінку.');
      }
    };

    checkConnection();
  }, []);

  // Відображення стану завантаження під час перевірки з'єднання
  if (isSupabaseConnected === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-gray-700">Перевірка з'єднання з базою даних...</p>
      </div>
    );
  }

  // Відображення помилки, якщо з'єднання не встановлено
  if (isSupabaseConnected === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-lg text-center">
          <h2 className="text-xl font-bold mb-2">Помилка з'єднання</h2>
          <p className="mb-4">{connectionError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router basename="/event-management-system.github.io">
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;