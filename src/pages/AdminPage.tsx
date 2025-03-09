import React from 'react';
import AdminPanel from '../components/AdminPanel';

const AdminPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Адміністрування системи</h1>
      <AdminPanel />
    </div>
  );
};

export default AdminPage; 