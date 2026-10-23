-- Seed data for daycares table (idempotente)
insert into public.daycares (id, name, address)
values 
  ('11111111-1111-1111-1111-111111111111', 'Guardería Sala Soles', 'Av. Principal 123, Centro'),
  ('22222222-2222-2222-2222-222222222222', 'Guardería Arcoíris', 'Calle Luna 456, Zona Norte'),
  ('33333333-3333-3333-3333-333333333333', 'Guardería Semillitas', 'Blvd. del Sol 789, Col. Jardines'),
  ('44444444-4444-4444-4444-444444444444', 'Guardería Estrellitas', 'Paseo de los Niños 321, Residencial')
on conflict (id) do nothing;