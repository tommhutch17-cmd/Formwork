-- Run this in Supabase SQL Editor.
-- It creates Formwork: company profile, projects, estimate generator, variation tracker, site diary, snagging list, subscriptions, and logo storage policies.

create extension if not exists pgcrypto;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  logo_url text,
  address text,
  email text,
  phone text,
  vat_number text,
  company_number text,
  payment_terms text default 'Payment due within 14 days of invoice.',
  quote_validity text default 'Quote valid for 30 days',
  footer_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(owner_id)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  project_name text not null,
  project_address text,
  client_name text not null,
  client_email text,
  client_address text,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.estimates (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  quote_number text,
  title text,
  notes text,
  vat_rate numeric default 20,
  markup_percent numeric default 0,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(project_id)
);

create table if not exists public.estimate_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  estimate_id uuid not null references public.estimates(id) on delete cascade,
  category text,
  description text,
  qty numeric default 0,
  unit text,
  rate numeric default 0,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.variation_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  variation_no text,
  description text,
  instructed_by text,
  status text default 'Draft',
  amount numeric default 0,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.site_diary_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  diary_date date default current_date,
  weather text,
  labour text,
  works text,
  deliveries text,
  delays text,
  instructions text,
  created_at timestamptz default now()
);

create table if not exists public.snag_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  location text,
  trade text,
  description text,
  priority text default 'Normal',
  status text default 'Open',
  due_date date,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text,
  status text default 'trial',
  updated_at timestamptz default now()
);

alter table public.companies enable row level security;
alter table public.projects enable row level security;
alter table public.estimates enable row level security;
alter table public.estimate_items enable row level security;
alter table public.variation_items enable row level security;
alter table public.site_diary_entries enable row level security;
alter table public.snag_items enable row level security;
alter table public.subscriptions enable row level security;

-- Re-runnable policies

drop policy if exists "companies owner select" on public.companies;
drop policy if exists "companies owner insert" on public.companies;
drop policy if exists "companies owner update" on public.companies;
drop policy if exists "companies owner delete" on public.companies;
create policy "companies owner select" on public.companies for select using (auth.uid() = owner_id);
create policy "companies owner insert" on public.companies for insert with check (auth.uid() = owner_id);
create policy "companies owner update" on public.companies for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "companies owner delete" on public.companies for delete using (auth.uid() = owner_id);

drop policy if exists "projects owner select" on public.projects;
drop policy if exists "projects owner insert" on public.projects;
drop policy if exists "projects owner update" on public.projects;
drop policy if exists "projects owner delete" on public.projects;
create policy "projects owner select" on public.projects for select using (auth.uid() = owner_id);
create policy "projects owner insert" on public.projects for insert with check (auth.uid() = owner_id);
create policy "projects owner update" on public.projects for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "projects owner delete" on public.projects for delete using (auth.uid() = owner_id);

drop policy if exists "estimates owner select" on public.estimates;
drop policy if exists "estimates owner insert" on public.estimates;
drop policy if exists "estimates owner update" on public.estimates;
drop policy if exists "estimates owner delete" on public.estimates;
create policy "estimates owner select" on public.estimates for select using (auth.uid() = owner_id);
create policy "estimates owner insert" on public.estimates for insert with check (auth.uid() = owner_id);
create policy "estimates owner update" on public.estimates for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "estimates owner delete" on public.estimates for delete using (auth.uid() = owner_id);

drop policy if exists "estimate items owner select" on public.estimate_items;
drop policy if exists "estimate items owner insert" on public.estimate_items;
drop policy if exists "estimate items owner update" on public.estimate_items;
drop policy if exists "estimate items owner delete" on public.estimate_items;
create policy "estimate items owner select" on public.estimate_items for select using (auth.uid() = owner_id);
create policy "estimate items owner insert" on public.estimate_items for insert with check (auth.uid() = owner_id);
create policy "estimate items owner update" on public.estimate_items for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "estimate items owner delete" on public.estimate_items for delete using (auth.uid() = owner_id);

drop policy if exists "variation items owner select" on public.variation_items;
drop policy if exists "variation items owner insert" on public.variation_items;
drop policy if exists "variation items owner update" on public.variation_items;
drop policy if exists "variation items owner delete" on public.variation_items;
create policy "variation items owner select" on public.variation_items for select using (auth.uid() = owner_id);
create policy "variation items owner insert" on public.variation_items for insert with check (auth.uid() = owner_id);
create policy "variation items owner update" on public.variation_items for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "variation items owner delete" on public.variation_items for delete using (auth.uid() = owner_id);

drop policy if exists "site diary owner select" on public.site_diary_entries;
drop policy if exists "site diary owner insert" on public.site_diary_entries;
drop policy if exists "site diary owner update" on public.site_diary_entries;
drop policy if exists "site diary owner delete" on public.site_diary_entries;
create policy "site diary owner select" on public.site_diary_entries for select using (auth.uid() = owner_id);
create policy "site diary owner insert" on public.site_diary_entries for insert with check (auth.uid() = owner_id);
create policy "site diary owner update" on public.site_diary_entries for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "site diary owner delete" on public.site_diary_entries for delete using (auth.uid() = owner_id);

drop policy if exists "snag items owner select" on public.snag_items;
drop policy if exists "snag items owner insert" on public.snag_items;
drop policy if exists "snag items owner update" on public.snag_items;
drop policy if exists "snag items owner delete" on public.snag_items;
create policy "snag items owner select" on public.snag_items for select using (auth.uid() = owner_id);
create policy "snag items owner insert" on public.snag_items for insert with check (auth.uid() = owner_id);
create policy "snag items owner update" on public.snag_items for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "snag items owner delete" on public.snag_items for delete using (auth.uid() = owner_id);

drop policy if exists "subscriptions owner select" on public.subscriptions;
create policy "subscriptions owner select" on public.subscriptions for select using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('company-logos', 'company-logos', true)
on conflict (id) do nothing;

drop policy if exists "logo public read" on storage.objects;
drop policy if exists "logo owner upload" on storage.objects;
drop policy if exists "logo owner update" on storage.objects;
drop policy if exists "logo owner delete" on storage.objects;
create policy "logo public read" on storage.objects for select using (bucket_id = 'company-logos');
create policy "logo owner upload" on storage.objects for insert with check (bucket_id = 'company-logos' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "logo owner update" on storage.objects for update using (bucket_id = 'company-logos' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "logo owner delete" on storage.objects for delete using (bucket_id = 'company-logos' and auth.uid()::text = (storage.foldername(name))[1]);
