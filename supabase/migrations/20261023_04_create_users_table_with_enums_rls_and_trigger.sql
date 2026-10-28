-- Create enums if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('staff', 'parent', 'admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
    CREATE TYPE public.user_status AS ENUM ('pending', 'active');
  END IF;
END
$$;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  daycare_id uuid REFERENCES public.daycares(id),
  role user_role NOT NULL,
  status user_status NOT NULL DEFAULT 'active',
  full_name text NOT NULL,
  avatar_url text,
  notify_on_post boolean NOT NULL DEFAULT true,
  daily_summary_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security en la tabla users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing RLS policies if they exist to ensure idempotency
DO $$
BEGIN
  DROP POLICY IF EXISTS "users_select_same_daycare" ON public.users;
  DROP POLICY IF EXISTS "users_update_own" ON public.users;
END
$$;

-- Política de lectura: usuarios autenticados pueden ver usuarios de su misma guardería
CREATE POLICY "users_read_own_daycare" ON public.users
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT u.id FROM public.users u WHERE u.daycare_id = users.daycare_id
    )
  );

-- Escritura: solo staff y admin pueden insertar
CREATE POLICY "users_staff_insert" ON public.users
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT u.id FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('staff', 'admin')
    )
  );

-- Actualización: staff y admin pueden actualizar
CREATE POLICY "users_staff_update" ON public.users
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT u.id FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('staff', 'admin')
    )
  );

-- Eliminación: solo admin puede eliminar
CREATE POLICY "users_admin_delete" ON public.users
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT u.id FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );