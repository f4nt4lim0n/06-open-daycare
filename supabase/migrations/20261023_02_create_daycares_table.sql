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

-- Habilitar RLS y política de lectura para authenticated
alter table public.daycares enable row level security;

create policy daycares_select_authenticated
  on public.daycares
  for select
  to authenticated
  using (true);