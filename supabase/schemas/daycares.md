# daycares

| Campo | Tipo | Notas |
| ----- | ---- | ----- |
| `id` | `uuid` PK | Identificador único, default `gen_random_uuid()` |
| `name` | `text` not null | Nombre de la guardería |
| `address` | `text` | Dirección física (nullable) |
| `created_at` | `timestamptz` | Fecha de creación, default now() |
| `updated_at` | `timestamptz` | Fecha de actualización, default now(), mantenido por trigger |