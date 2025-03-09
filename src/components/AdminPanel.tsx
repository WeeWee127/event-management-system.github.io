import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth, UserRole } from '../contexts/AuthContext';

type UserWithRole = {
  id: string;
  email: string;
  role: UserRole;
};

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Отримуємо всіх користувачів через Supabase Auth API
        const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
        
        if (usersError) throw usersError;

        // Отримуємо всі ролі з user_roles таблиці
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');
          
        if (rolesError) throw rolesError;

        // Створюємо мапу ролей
        const roleMap = new Map();
        rolesData.forEach((role: any) => {
          roleMap.set(role.user_id, role.role);
        });

        // Обʼєднуємо дані
        const combinedUsers = usersData.users.map((user: any) => ({
          id: user.id,
          email: user.email,
          role: roleMap.get(user.id) || UserRole.USER
        }));

        setUsers(combinedUsers);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Помилка завантаження користувачів');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleRoleChange = async (userId: string, role: UserRole) => {
    try {
      setError(null);
      
      // Оновлюємо роль в базі даних
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role }, { onConflict: 'user_id' });
      
      if (error) throw error;
      
      // Оновлюємо стан в інтерфейсі
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role } : user
      ));
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Помилка оновлення ролі');
      console.error('Error updating role:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-red-600">Доступ заборонено</h2>
        <p className="mt-2">У вас немає прав адміністратора для перегляду цієї сторінки.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Панель адміністратора</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Роль</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 whitespace-nowrap">{user.email}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === UserRole.ADMIN 
                      ? 'bg-red-100 text-red-800' 
                      : user.role === UserRole.MODERATOR 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    className="border rounded px-2 py-1"
                  >
                    <option value={UserRole.USER}>Користувач</option>
                    <option value={UserRole.MODERATOR}>Модератор</option>
                    <option value={UserRole.ADMIN}>Адміністратор</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {users.length === 0 && (
        <div className="text-center py-4">
          <p>Користувачів не знайдено</p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 