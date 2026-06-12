-- Add admins table to manage admin users by auth.uid()
create table if not exists public.admins (
  id uuid default gen_random_uuid() primary key,
  uid uuid not null unique,
  created_at timestamptz default now()
);

-- Allow select for everyone
alter table public.admins enable row level security;
create policy "allow select admins" on public.admins for select using (true);

-- Provide helper policies for cars/car_images allowing admins by uid
create policy "admins_table_write_cars" on public.cars
  for all using (
    exists (select 1 from public.admins a where a.uid = auth.uid())
  ) with check (
    exists (select 1 from public.admins a where a.uid = auth.uid())
  );

create policy "admins_table_write_car_images" on public.car_images
  for all using (
    exists (select 1 from public.admins a where a.uid = auth.uid())
  ) with check (
    exists (select 1 from public.admins a where a.uid = auth.uid())
  );

-- Example insert (commented):
-- insert into public.admins (uid) values ('<auth-uid-of-admin>');
