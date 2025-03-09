import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import RoleBasedRoute from './components/RoleBasedRoute';
import { UserRole } from './contexts/AuthContext';

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
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              
              {/* Захищені маршрути для звичайних користувачів */}
              <Route path="my-events" element={
                <RoleBasedRoute>
                  <MyEventsPage />
                </RoleBasedRoute>
              } />
              <Route path="create-event" element={
                <RoleBasedRoute>
                  <CreateEventPage />
                </RoleBasedRoute>
              } />
              <Route path="edit-event/:id" element={
                <RoleBasedRoute>
                  <EditEventPage />
                </RoleBasedRoute>
              } />
              
              {/* Документація доступна всім */}
              <Route path="documentation" element={<DocumentationPage />} />
              
              {/* Захищений маршрут тільки для адміністраторів */}
              <Route path="admin" element={
                <RoleBasedRoute requiredRole={UserRole.ADMIN}>
                  <AdminPage />
                </RoleBasedRoute>
              } />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;