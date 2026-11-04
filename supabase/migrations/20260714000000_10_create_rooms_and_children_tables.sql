-- SPEC 10 — Rooms y Children: tablas, RLS, seed rooms y enums
-- Depende de: SPEC 07 (daycares table), SPEC 08 (users table + enums)
-- Fecha: 2026-07-09

-- 1. Enum child_status (si no existe ya)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'child_status') THEN
    CREATE TYPE child_status AS ENUM ('active', 'archived');
  END IF;
END $$;

-- 2. Enum relationship_type (solo si no existe; Spec 11 ya lo creó)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'relationship_type') THEN
    CREATE TYPE relationship_type AS ENUM ('father', 'mother', 'guardian');
  END IF;
END $$;

-- 3. Tabla rooms
CREATE TABLE rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daycare_id uuid NOT NULL REFERENCES daycares(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para rooms
-- Lectura: usuarios autenticados de la misma guardería
CREATE POLICY "rooms_read_own_daycare" ON rooms
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT u.id FROM users u WHERE u.daycare_id = rooms.daycare_id
    )
  );

-- Escritura: solo staff y admin
CREATE POLICY "rooms_staff_write" ON rooms
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT u.id FROM users u WHERE u.id = auth.uid() AND u.role IN ('staff', 'admin')
    )
  );

-- 4. Tabla children
CREATE TABLE children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  birth_date date NOT NULL,
  enrolled_at date NOT NULL,
  medical_notes text,
  allergy_tags text[],
  photo_consent boolean NOT NULL DEFAULT true,
  status child_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para children
-- Lectura: usuarios autenticados de la misma guardería
CREATE POLICY "children_read_own_daycare" ON children
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT u.id FROM users u WHERE u.daycare_id = (
        SELECT r.daycare_id FROM rooms r WHERE r.id = children.room_id
      )
    )
  );

-- Escritura: solo staff y admin
CREATE POLICY "children_staff_write" ON children
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT u.id FROM users u WHERE u.id = auth.uid() AND u.role IN ('staff', 'admin')
    )
  );

-- 5. Seed data: 3 rooms para el daycare existente (sin children)
INSERT INTO rooms (daycare_id, name)
SELECT id, 'Soles' FROM daycares LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO rooms (daycare_id, name)
SELECT id, 'Estrellas' FROM daycares LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO rooms (daycare_id, name)
SELECT id, 'Arcoíris' FROM daycares LIMIT 1
ON CONFLICT DO NOTHING;