import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Session, User } from '@supabase/supabase-js';

// Типи для ролей користувачів
export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

// Інтерфейс для контексту авторизації
type AuthContextType = {
  session: Session | null;
  user: User | null;
  userRole: UserRole;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    user: User | null;
  }>;
  signOut: () => Promise<void>;
  getUserRole: () => Promise<UserRole>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isModerator: boolean;
};

// Створення контексту автентифікації
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Хук для використання контексту
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Провайдер автентифікації
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.USER);
  const [loading, setLoading] = useState(true);

  // Ініціалізація авторизації при завантаженні
  useEffect(() => {
    const initializeAuth = async () => {
      // Отримання поточної сесії
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        const role = await getUserRole();
        setUserRole(role);
      }

      setLoading(false);

      // Підписка на зміни авторизації
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, currentSession) => {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
            const role = await getUserRole();
            setUserRole(role);
          } else {
            setUserRole(UserRole.USER);
          }

          setLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, []);

  // Отримання ролі користувача з бази даних
  const getUserRole = async (): Promise<UserRole> => {
    if (!user) return UserRole.USER;

    // Спроба отримати роль з user_roles таблиці
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      // Якщо роль не знайдена, створюємо запис з роллю USER
      await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: UserRole.USER });
        
      return UserRole.USER;
    }

    return data.role as UserRole;
  };

  // Авторизація користувача
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  // Реєстрація нового користувача
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error && data.user) {
      // Створення запису про роль для нового користувача
      await supabase
        .from('user_roles')
        .insert({ user_id: data.user.id, role: UserRole.USER });
    }

    return { error, user: data.user };
  };

  // Вихід з системи
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Доступні значення в контексті
  const value = {
    session,
    user,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    getUserRole,
    isAuthenticated: !!user,
    isAdmin: userRole === UserRole.ADMIN,
    isModerator: userRole === UserRole.MODERATOR || userRole === UserRole.ADMIN,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 