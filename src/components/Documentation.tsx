import React from 'react';

const Documentation = () => {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Документація до лабораторних робіт</h1>
      
      <div className="space-y-8">
        {/* Лабораторна робота №2 */}
        <section className="border-b pb-6">
          <h2 className="text-2xl font-bold mb-4">Лабораторна робота №2: Форми та валідація</h2>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-bold mb-2">1. Форми для введення даних</h3>
              <p className="mb-2">У проекті реалізовано наступні форми:</p>
              <ul className="list-disc pl-6 mb-2">
                <li><strong>Форма реєстрації</strong> (/register) - для створення нового акаунту</li>
                <li><strong>Форма створення події</strong> (/create-event) - для створення нової події</li>
              </ul>
              <p>Приклад коду форми реєстрації:</p>
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
{`// Схема валідації
const registerSchema = z.object({
  email: z.string().email('Введіть коректну email адресу'),
  password: z.string()
    .min(6, 'Пароль має бути не менше 6 символів')
    .max(50, 'Пароль занадто довгий'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Паролі не співпадають",
  path: ["confirmPassword"],
});`}
              </pre>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-2">2. Валідація даних користувача</h3>
              <p className="mb-2">Для валідації використано бібліотеку Zod (аналог Laravel валідації для React):</p>
              <ul className="list-disc pl-6">
                <li>Валідація email</li>
                <li>Валідація мінімальної/максимальної довжини</li>
                <li>Валідація значень (min/max для чисел)</li>
                <li>Перевірка порівняння полів (наприклад, паролів)</li>
                <li>Користувацькі правила валідації через refine</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-2">3. Відображення помилок валідації</h3>
              <p className="mb-2">Помилки відображаються безпосередньо під кожним полем форми:</p>
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
{`<input
  type="email"
  {...register('email')}
  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
/>
{errors.email && (
  <p className="mt-1 text-sm text-red-600">
    {errors.email.message}
  </p>
)}`}
              </pre>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-2">4. Захист від CSRF атак</h3>
              <p className="mb-2">У проекті використовуються наступні механізми захисту:</p>
              <ul className="list-disc pl-6">
                <li><strong>JWT токени</strong> - замість cookie для автентифікації</li>
                <li><strong>HTTPS</strong> - для шифрування всіх запитів</li>
                <li><strong>Supabase Auth</strong> - сучасна авторизація, стійка до CSRF</li>
                <li><strong>React SPA</strong> - архітектура, яка не вразлива до традиційних CSRF</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-2">5. Використання Form Request Objects</h3>
              <p className="mb-2">Для складної валідації використані схеми Zod (аналог Form Request Objects):</p>
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
{`// Приклад складної валідації
registrationDeadline: z.string()
  .refine(
    (date, ctx) => {
      const deadlineDate = new Date(date);
      const eventDate = new Date(ctx.parent.date);
      return deadlineDate < eventDate;
    },
    'Дедлайн реєстрації має бути раніше дати події'
  )`}
              </pre>
            </section>
          </div>
        </section>
        
        {/* Лабораторна робота №3 */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Лабораторна робота №3: Автентифікація та авторизація</h2>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-bold mb-2">1. Система автентифікації</h3>
              <p className="mb-2">Використано Supabase Auth замість Laravel Fortify/Breeze:</p>
              <ul className="list-disc pl-6 mb-2">
                <li>Реєстрація користувачів</li>
                <li>Вхід за допомогою email/пароль</li>
                <li>Зберігання сесій через JWT токени</li>
                <li>Безпечний вихід користувачів</li>
              </ul>
              <p>Реалізація через контекст автентифікації:</p>
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
{`// Створення контексту автентифікації
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер автентифікації
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.USER);
  // ...

  // Підписка на зміни авторизації
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        // ...
      }
    );
  }, []);
}`}
              </pre>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-2">2. Система ролей користувачів</h3>
              <p className="mb-2">Реалізовано систему ролей з трьома рівнями доступу:</p>
              <ul className="list-disc pl-6 mb-2">
                <li><strong>USER</strong> - звичайний користувач (базові права)</li>
                <li><strong>MODERATOR</strong> - модератор (проміжні права)</li>
                <li><strong>ADMIN</strong> - адміністратор (повні права)</li>
              </ul>
              <p>Enum для типів ролей:</p>
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
{`export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}`}
              </pre>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-2">3. Захист маршрутів (Middleware)</h3>
              <p className="mb-2">Створено компонент RoleBasedRoute для захисту маршрутів:</p>
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
{`// Захищений маршрут, який вимагає авторизацію
<Route path="my-events" element={
  <RoleBasedRoute>
    <MyEventsPage />
  </RoleBasedRoute>
} />

// Захищений маршрут, який вимагає роль адміністратора
<Route path="admin" element={
  <RoleBasedRoute requiredRole={UserRole.ADMIN}>
    <AdminPage />
  </RoleBasedRoute>
} />`}
              </pre>
              <p className="mt-2">Реалізація перевірки ролей:</p>
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
{`// Перевіряємо авторизацію
if (!isAuthenticated) {
  return <Navigate to={redirectTo} replace />;
}

// Якщо потрібна певна роль, перевіряємо її
if (requiredRole) {
  const hasRequiredRole = 
    requiredRole === UserRole.ADMIN ? userRole === UserRole.ADMIN :
    requiredRole === UserRole.MODERATOR ? 
      (userRole === UserRole.MODERATOR || userRole === UserRole.ADMIN) : 
      true;
      
  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }
}`}
              </pre>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-2">4. Адміністративна панель</h3>
              <p className="mb-2">Реалізовано панель керування ролями користувачів:</p>
              <ul className="list-disc pl-6 mb-2">
                <li>Перегляд списку користувачів (тільки для адміністраторів)</li>
                <li>Зміна ролей користувачів</li>
                <li>Додаткові права для різних ролей</li>
              </ul>
              <p>Бізнес-логіка доступу:</p>
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
{`// Перевірка прав адміністратора
if (!isAdmin) {
  return (
    <div className="text-center p-8">
      <h2 className="text-xl font-bold text-red-600">Доступ заборонено</h2>
      <p className="mt-2">У вас немає прав адміністратора для перегляду цієї сторінки.</p>
    </div>
  );
}`}
              </pre>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-2">5. Policies для гранулярного контролю доступу</h3>
              <p className="mb-2">Реалізовано через Row Level Security (RLS) у Supabase та інтерфейсні перевірки:</p>
              <ul className="list-disc pl-6 mb-2">
                <li>Користувачі можуть бачити всі події</li>
                <li>Користувачі можуть редагувати тільки власні події</li>
                <li>Модератори можуть редагувати всі події</li>
                <li>Адміністратори мають повний доступ до всіх ресурсів</li>
              </ul>
              <p>Бізнес-логіка в інтерфейсі:</p>
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
{`// Перевірка прав на редагування події
const canEditEvent = 
  isAdmin || 
  isModerator || 
  (isAuthenticated && event.created_by === user.id);

// Відображення кнопки редагування
{canEditEvent && (
  <Link to={\`/edit-event/\${event.id}\`} className="btn-edit">
    Редагувати
  </Link>
)}`}
              </pre>
            </section>
          </div>
        </section>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Технічні деталі реалізації:</h3>
        <ul className="list-disc pl-6">
          <li>Фреймворк: <strong>React + Vite</strong></li>
          <li>БД та бекенд: <strong>Supabase</strong></li>
          <li>Бібліотека форм: <strong>React Hook Form</strong></li>
          <li>Бібліотека валідації: <strong>Zod</strong></li>
          <li>Стилізація: <strong>Tailwind CSS</strong></li>
          <li>Авторизація: <strong>Supabase Auth + Контекст</strong></li>
        </ul>
      </div>
    </div>
  );
};

export default Documentation; 