create extension if not exists pgcrypto;

create type public.app_role as enum ('executive','operations','sales','accounting','warehouse','crew','admin');
create type public.work_status as enum ('draft','ready','in_progress','waiting','blocked','in_review','approved','complete','archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role public.app_role not null default 'operations',
  department text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_number text unique,
  name text not null,
  tier text,
  status text not null default 'Active',
  account_owner uuid references public.profiles(id),
  address text,
  phone text,
  website text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.facilities (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  name text not null,
  facility_type text,
  address text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.spaces (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references public.facilities(id) on delete cascade,
  name text not null,
  space_type text,
  floor_system text,
  square_feet numeric,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  project_number text unique,
  customer_id uuid references public.customers(id),
  facility_id uuid references public.facilities(id),
  space_id uuid references public.spaces(id),
  name text not null,
  project_type text,
  status public.work_status not null default 'draft',
  owner_id uuid references public.profiles(id),
  start_date date,
  target_date date,
  contract_value numeric(14,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status public.work_status not null default 'ready',
  priority text not null default 'normal',
  due_at timestamptz,
  assigned_to uuid references public.profiles(id),
  created_by uuid references public.profiles(id),
  customer_id uuid references public.customers(id),
  facility_id uuid references public.facilities(id),
  project_id uuid references public.projects(id),
  module text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workflow_definitions (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  module text,
  stages jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.workflow_instances (
  id uuid primary key default gen_random_uuid(),
  definition_id uuid not null references public.workflow_definitions(id),
  record_type text not null,
  record_id uuid not null,
  current_stage text not null,
  status public.work_status not null default 'in_progress',
  owner_id uuid references public.profiles(id),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  customer_id uuid references public.customers(id),
  facility_id uuid references public.facilities(id),
  project_id uuid references public.projects(id),
  module text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  record_type text not null,
  record_id uuid,
  customer_id uuid references public.customers(id),
  project_id uuid references public.projects(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.facilities enable row level security;
alter table public.spaces enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.workflow_definitions enable row level security;
alter table public.workflow_instances enable row level security;
alter table public.documents enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_log enable row level security;

create function public.current_role() returns public.app_role language sql stable security definer set search_path=public as $$
  select role from public.profiles where id = auth.uid();
$$;

create policy "authenticated profiles read" on public.profiles for select to authenticated using (true);
create policy "users update own profile" on public.profiles for update to authenticated using (id=auth.uid()) with check (id=auth.uid());

create policy "authenticated read customers" on public.customers for select to authenticated using (true);
create policy "office roles manage customers" on public.customers for all to authenticated using (public.current_role() in ('executive','operations','sales','accounting','admin')) with check (public.current_role() in ('executive','operations','sales','accounting','admin'));
create policy "authenticated read facilities" on public.facilities for select to authenticated using (true);
create policy "office roles manage facilities" on public.facilities for all to authenticated using (public.current_role() in ('executive','operations','sales','admin')) with check (public.current_role() in ('executive','operations','sales','admin'));
create policy "authenticated read spaces" on public.spaces for select to authenticated using (true);
create policy "office roles manage spaces" on public.spaces for all to authenticated using (public.current_role() in ('executive','operations','sales','admin')) with check (public.current_role() in ('executive','operations','sales','admin'));

create policy "authenticated read projects" on public.projects for select to authenticated using (true);
create policy "office roles manage projects" on public.projects for all to authenticated using (public.current_role() in ('executive','operations','sales','accounting','admin')) with check (public.current_role() in ('executive','operations','sales','accounting','admin'));

create policy "authenticated read tasks" on public.tasks for select to authenticated using (true);
create policy "authenticated create tasks" on public.tasks for insert to authenticated with check (created_by=auth.uid() or created_by is null);
create policy "task owners and admins update" on public.tasks for update to authenticated using (assigned_to=auth.uid() or created_by=auth.uid() or public.current_role() in ('executive','admin'));

create policy "authenticated read workflows" on public.workflow_definitions for select to authenticated using (true);
create policy "admins manage workflow definitions" on public.workflow_definitions for all to authenticated using (public.current_role() in ('executive','admin')) with check (public.current_role() in ('executive','admin'));
create policy "authenticated read workflow instances" on public.workflow_instances for select to authenticated using (true);
create policy "office roles manage workflow instances" on public.workflow_instances for all to authenticated using (public.current_role() in ('executive','operations','sales','accounting','admin')) with check (public.current_role() in ('executive','operations','sales','accounting','admin'));

create policy "authenticated read documents" on public.documents for select to authenticated using (true);
create policy "authenticated upload documents" on public.documents for insert to authenticated with check (uploaded_by=auth.uid());
create policy "users read own notifications" on public.notifications for select to authenticated using (user_id=auth.uid());
create policy "users update own notifications" on public.notifications for update to authenticated using (user_id=auth.uid());
create policy "authenticated read activity" on public.activity_log for select to authenticated using (true);
create policy "authenticated create activity" on public.activity_log for insert to authenticated with check (actor_id=auth.uid());

insert into public.workflow_definitions (name,module,stages) values
('Quote to Project','Quoting','["Intake","Build","Rep Review","Customer Approval","Project Created"]'),
('Order Fulfillment','FinishLine','["Ordered","Confirmed","Receiving","Staged","Delivered"]'),
('AIA Pay Application','ContractOps','["PM Update","Controller Review","Signature","Notary","Submitted"]'),
('Logo Mat Approval','MatBuilder Pro','["Field Intake","Vendor Estimate","Proof Review","Customer Signoff","Production"]');
