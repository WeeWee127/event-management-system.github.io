import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Перевірка наявності змінних середовища
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Перевірка та логування, чи змінні середовища доступні
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Помилка: Відсутні необхідні змінні середовища для Supabase.',
    {
      VITE_SUPABASE_URL: supabaseUrl ? 'доступний' : 'відсутній',
      VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'доступний' : 'відсутній',
    }
  );
}

// Створення клієнта з додатковими налаштуваннями
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      // Додаємо обробник помилки для всіх запитів
      fetch: (...args) => {
        return fetch(...args).catch(error => {
          console.error('Помилка мережі при запиті до Supabase:', error);
          throw error;
        });
      }
    },
  }
);

// Допоміжна функція для перевірки з'єднання
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('events').select('count', { count: 'exact' });
    if (error) throw error;
    console.log('Supabase з\'єднання успішне. Кількість подій:', data);
    return true;
  } catch (error) {
    console.error('Помилка з\'єднання з Supabase:', error);
    return false;
  }
}

// Функція для отримання змінних середовища Supabase
export function getSupabaseEnvVars() {
  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey ? '********' : undefined // Не показуємо повний ключ для безпеки
  };
}

// Виводимо дані про змінні середовища в консоль при імпорті
console.log('Environment Variables:', getSupabaseEnvVars());