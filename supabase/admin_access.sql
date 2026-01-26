-- Create a simple key-value store for system settings
create table if not exists public.system_settings (
  key text primary key,
  value text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.system_settings enable row level security;

-- Only admins/service role can select
create policy "Allow admins to read settings" on public.system_settings
  for select using (
    exists (
      select 1 from public.users 
      where users.id = auth.uid() 
      and users.role in ('admin', 'super_admin')
    )
  );

-- Insert the secret token
insert into public.system_settings (key, value, description)
values (
  'admin_access_token', 
  'cc3c7096e9aa224272a0a4deed046e89e933853243ba0ec993ddcb6f9e387418', 
  'Secret token for persistent admin access via /api/auth/persistent'
) on conflict (key) do update set value = excluded.value;
