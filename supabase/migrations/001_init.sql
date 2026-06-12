-- Initial schema for HotWheels Collection
-- Creates `cars` and `car_images` tables with RLS policies.

-- Create extension for UUID generation
create extension if not exists "pgcrypto";

-- Cars table
create table if not exists public.cars (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  brand text,
  series text,
  year int,
  color text,
  model_number text,
  manufacturer text,
  condition text,
  rarity text,
  purchase_date date,
  purchase_price numeric(10,2),
  purchase_location text,
  quantity int default 1,
  description text,
  notes text,
  tags text[] default '{}',
  extra_attributes jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Car images table
create table if not exists public.car_images (
  id uuid default gen_random_uuid() primary key,
  car_id uuid references public.cars(id) on delete cascade,
  image_url text not null,
  display_order int default 0,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.cars enable row level security;
alter table public.car_images enable row level security;

-- Policies:
-- 1) Public (anonymous) users may SELECT (read-only)
create policy "allow select to anon" on public.cars for select using (true);
create policy "allow select to anon" on public.car_images for select using (true);

-- 2) Admins may insert/update/delete. We expect a custom JWT claim `role` set to 'admin'.
-- Example condition: (current_setting('request.jwt.claims')::json->>'role') = 'admin'
create policy "admins can write cars" on public.cars for all using (
  (auth.role() = 'authenticated' and (current_setting('request.jwt.claims')::json->> 'role') = 'admin')
) with check (
  (auth.role() = 'authenticated' and (current_setting('request.jwt.claims')::json->> 'role') = 'admin')
);

create policy "admins can write images" on public.car_images for all using (
  (auth.role() = 'authenticated' and (current_setting('request.jwt.claims')::json->> 'role') = 'admin')
) with check (
  (auth.role() = 'authenticated' and (current_setting('request.jwt.claims')::json->> 'role') = 'admin')
);

-- Trigger to update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cars_set_updated_at on public.cars;
create trigger cars_set_updated_at before update on public.cars
for each row execute procedure set_updated_at();
