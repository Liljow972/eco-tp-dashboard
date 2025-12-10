-- Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  name text,
  company text,
  role text check (role in ('admin', 'client')) default 'client',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Create projects table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  status text check (status in ('pending', 'in_progress', 'completed')) default 'pending',
  progress integer default 0,
  client_id uuid references public.profiles(id),
  budget numeric default 0,
  spent numeric default 0,
  start_date date,
  end_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.projects enable row level security;

-- Policies
create policy "Admins view all projects" on projects for select using (
  exists ( select 1 from profiles where id = auth.uid() and role = 'admin' )
);

create policy "Clients view own projects" on projects for select using (
  client_id = auth.uid()
);

-- TIMELINE STEPS (Optional, for detailed tracking)
create table if not exists public.project_steps (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  description text,
  status text check (status in ('pending', 'in_progress', 'completed')) default 'pending',
  order_index integer,
  completed_at timestamp with time zone
);

alter table public.project_steps enable row level security;

create policy "Admins view all steps" on project_steps for select using (
  exists ( select 1 from profiles where id = auth.uid() and role = 'admin' )
);

create policy "Clients view own project steps" on project_steps for select using (
  exists ( select 1 from projects where id = project_steps.project_id and client_id = auth.uid() )
);

-- DOCUMENTS (GED)
create table if not exists public.documents (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  file_path text not null, -- Storage path
  size bigint,
  type text,
  owner_id uuid references public.profiles(id),
  project_id uuid references public.projects(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.documents enable row level security;

create policy "Admins manage all documents" on documents for all using (
  exists ( select 1 from profiles where id = auth.uid() and role = 'admin' )
);

create policy "Clients view own documents" on documents for select using (
  owner_id = auth.uid() or 
  exists ( select 1 from projects where id = documents.project_id and client_id = auth.uid() )
);

-- COLLABORATION TASKS
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  status text check (status in ('todo', 'in_progress', 'done')) default 'todo',
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  project_id uuid references public.projects(id),
  assignee_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tasks enable row level security;

create policy "Admins manage all tasks" on tasks for all using (
  exists ( select 1 from profiles where id = auth.uid() and role = 'admin' )
);
