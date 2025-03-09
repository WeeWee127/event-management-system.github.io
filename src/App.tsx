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

  console.log('App rendering...');

  useEffect(() => {
    // Перевірка з'єднання з Supabase при завантаженні додатка
    const checkConnection = async () => {
      try {
        const isConnected = await checkSupabaseConnection();
        console.log('Supabase connection status:', isConnected);
        setIsSupabaseConnected(isConnected);
        if (!isConnected) {
          setConnectionError('Не вдалося з\'єднатися з базою даних. Використовуємо тестові дані.');
        }
      } catch (error) {
        console.error('Помилка перевірки з\'єднання з Supabase:', error);
        setIsSupabaseConnected(false);
        setConnectionError('Виникла помилка при з\'єднанні з базою даних. Використовуємо тестові дані.');
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

  // Відображення попередження, якщо з'єднання не встановлено
  const ConnectionWarning = () => (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg mb-4">
      <p>{connectionError}</p>
    </div>
  );

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {!isSupabaseConnected && <ConnectionWarning />}
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