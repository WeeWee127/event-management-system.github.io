-- Створюємо перелік для ролей
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');

-- Створюємо таблицю для ролей користувачів
CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Додаємо Row Level Security (RLS)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Політики для таблиці ролей
-- Політика для читання: всі авторизовані користувачі можуть бачити свою роль
CREATE POLICY "Users can view their own role"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Політика для читання: адміністратори можуть бачити всі ролі
CREATE POLICY "Admins can view all roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Політика для оновлення: тільки адміністратори можуть змінювати ролі
CREATE POLICY "Admins can update roles"
  ON user_roles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Політика для вставки: тільки адміністратори можуть додавати нові ролі
CREATE POLICY "Admins can insert roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Початкові дані: створюємо першого адміністратора
-- Замініть 'YOUR_ADMIN_EMAIL' на email вашого адміністратора
CREATE OR REPLACE FUNCTION create_admin_role() RETURNS void AS $$
DECLARE
  admin_id UUID;
BEGIN
  -- Отримуємо ID користувача за email
  SELECT id INTO admin_id FROM auth.users WHERE email = 'YOUR_ADMIN_EMAIL';
  
  -- Якщо користувач існує, додаємо роль адміністратора
  IF admin_id IS NOT NULL THEN
    INSERT INTO user_roles (user_id, role)
    VALUES (admin_id, 'admin')
    ON CONFLICT (user_id) 
    DO UPDATE SET role = 'admin';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Виконуємо функцію
SELECT create_admin_role(); 