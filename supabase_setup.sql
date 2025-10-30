-- Create users table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  subscription_tier text default 'free' check (subscription_tier in ('free', 'premium')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create imported_models table
create table if not exists public.imported_models (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  file_url text not null,
  file_size bigint,
  thumbnail text default '📁',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.imported_models enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Imported models policies
create policy "Users can view own models"
  on public.imported_models for select
  using (auth.uid() = user_id);

create policy "Users can insert own models"
  on public.imported_models for insert
  with check (auth.uid() = user_id);

create policy "Users can update own models"
  on public.imported_models for update
  using (auth.uid() = user_id);

create policy "Users can delete own models"
  on public.imported_models for delete
  using (auth.uid() = user_id);

-- Create storage bucket for STL files
insert into storage.buckets (id, name, public)
values ('stl-files', 'stl-files', false)
on conflict (id) do nothing;

-- Storage policies
create policy "Users can upload own STL files"
  on storage.objects for insert
  with check (
    bucket_id = 'stl-files' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view own STL files"
  on storage.objects for select
  using (
    bucket_id = 'stl-files' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own STL files"
  on storage.objects for delete
  using (
    bucket_id = 'stl-files' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
