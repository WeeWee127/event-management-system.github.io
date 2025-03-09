import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Виводимо всі змінні середовища для діагностики
console.log('Environment variables in supabase.ts:');
console.log('import.meta.env:', import.meta.env);

// Отримуємо змінні середовища напряму з import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Жорстко закодовані значення як запасний варіант (використовувати тільки для розробки)
const fallbackUrl = 'https://qkicbsscsauxgwdktojb.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFraWNic3Njc2F1eGd3ZGt0b2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5OTUxMzcsImV4cCI6MjA1NjU3MTEzN30.02D1hUP6nVjNV-qjJPyIZp2YJJ27yFBHX1r7i6bjSZ4';

// Перевірка та логування, чи змінні середовища доступні
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Помилка: Відсутні необхідні змінні середовища для Supabase.',
    {
      VITE_SUPABASE_URL: supabaseUrl ? 'доступний' : 'відсутній',
      VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'доступний' : 'відсутній',
    }
  );
  console.log('Використовуємо запасні значення для розробки');
}

// Використовуємо наявні змінні або запасні значення
const finalSupabaseUrl = supabaseUrl || fallbackUrl;
const finalSupabaseKey = supabaseAnonKey || fallbackKey;

console.log('Final Supabase URL:', finalSupabaseUrl);
console.log('Final Supabase Key:', finalSupabaseKey ? '[HIDDEN]' : 'відсутній');

// Створення клієнта з додатковими налаштуваннями
export const supabase = createClient<Database>(
  finalSupabaseUrl,
  finalSupabaseKey,
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
    url: finalSupabaseUrl,
    anonKey: finalSupabaseKey ? '********' : undefined // Не показуємо повний ключ для безпеки
  };
}

// Виводимо дані про змінні середовища в консоль при імпорті
console.log('Environment Variables:', getSupabaseEnvVars());