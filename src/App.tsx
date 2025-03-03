import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

// Components
import Layout from './components/Layout';
import Auth from './components/Auth';

// Pages
import HomePage from './pages/HomePage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import MyEventsPage from './pages/MyEventsPage';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="my-events" element={
            <ProtectedRoute>
              <MyEventsPage />
            </ProtectedRoute>
          } />
          <Route path="create-event" element={
            <ProtectedRoute>
              <CreateEventPage />
            </ProtectedRoute>
          } />
          <Route path="edit-event/:id" element={
            <ProtectedRoute>
              <EditEventPage />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;