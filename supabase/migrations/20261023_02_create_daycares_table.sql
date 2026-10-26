-- Create the daycares table
create table public.daycares (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  address     text,               -- nullable: dirección física de la guardería
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Trigger de updated_at
create trigger daycares_set_updated_at
  before update on public.daycares
  for each row execute function public.set_updated_at();

-- Habilitar RLS en la tabla
alter table public.daycares enable row level security;

-- Política de lectura: cualquiera puede leer (preparado para auth futura)
create policy daycares_read
  on public.daycares
  for select
  using (true);

-- Política de escritura: INSERT restringida (WITH CHECK false)
create policy daycares_insert
  on public.daycares
  for insert
  with check (false);

-- Política de escritura: UPDATE restringida (USING false)
create policy daycares_update
  on public.daycares
  for update
  using (false);

-- Política de escritura: DELETE restringida (USING false)
create policy daycares_delete
  on public.daycares
  for delete
  using (false);

-- Datos semilla para la tabla daycares (idempotente)
insert into public.daycares (id, name, address)
values
  ('11111111-1111-1111-1111-111111111111', 'Guardería Sala Soles', 'Av. Principal 123, Centro'),
  ('22222222-2222-2222-2222-222222222222', 'Guardería Arcoíris', 'Calle Luna 456, Zona Norte'),
  ('33333333-3333-3333-3333-333333333333', 'Guardería Semillitas', 'Blvd. del Sol 789, Col. Jardines'),
  ('44444444-4444-4444-4444-444444444444', 'Guardería Estrellitas', 'Paseo de los Niños 321, Residencial')
on conflict (id) do nothing;