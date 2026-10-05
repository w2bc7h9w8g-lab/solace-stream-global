-- Programa Refugiados UNESCO — reference schema for Supabase (NOT auto-applied).
-- Privacy-by-design: no clinical content stored; only external references.

create type public.app_role as enum ('refugee','psychologist','university_partner','moderator','admin');
create type public.verification_status as enum ('pending','verified','rejected');
create type public.appointment_status as enum ('requested','confirmed','completed','cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  preferred_locale text not null default 'pt',
  country_region text,
  created_at timestamptz not null default now()
);
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create table public.psychologist_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  bio jsonb not null default '{}',            -- {pt,en}
  region text, years_experience int, populations text[] default '{}',
  is_public boolean not null default false     -- true only once verified
);
create table public.psychologist_verifications (   -- PRIVATE: never readable by public
  psychologist_id uuid primary key references public.psychologist_profiles(id) on delete cascade,
  status public.verification_status not null default 'pending',
  council text not null, registration_number_encrypted text not null,
  legal_name_encrypted text, identity_doc_ref text,   -- external secure storage ref
  background_check text default 'pending',
  submitted_at timestamptz default now(), reviewed_by uuid, reviewed_at timestamptz
);
create table public.specialties (id uuid primary key default gen_random_uuid(), slug text unique not null, name jsonb not null);
create table public.psychologist_specialties (psychologist_id uuid references public.psychologist_profiles(id) on delete cascade, specialty_id uuid references public.specialties(id), primary key (psychologist_id, specialty_id));
create table public.languages (code text primary key, name text not null);
create table public.psychologist_languages (psychologist_id uuid references public.psychologist_profiles(id) on delete cascade, language_code text references public.languages(code), primary key (psychologist_id, language_code));
create table public.refugee_profiles (id uuid primary key references public.profiles(id) on delete cascade, alias text not null, preferred_languages text[] default '{}');
create table public.availability (id uuid primary key default gen_random_uuid(), psychologist_id uuid not null references public.psychologist_profiles(id) on delete cascade, weekday int not null, start_time time not null, end_time time not null, timezone text not null);
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  psychologist_id uuid not null references public.psychologist_profiles(id),
  refugee_id uuid not null references public.refugee_profiles(id),
  starts_at timestamptz not null, duration_min int not null default 50,
  status public.appointment_status not null default 'requested',
  meet_link text, clinical_note_ref text,  -- pointer to external secure store only
  language text
);
create table public.universities (id uuid primary key default gen_random_uuid(), name text not null, country text, partnership_status text default 'prospective', owner_id uuid references auth.users(id));
create table public.scholarship_opportunities (
  id uuid primary key default gen_random_uuid(), university_id uuid not null references public.universities(id) on delete cascade,
  program jsonb not null, discount_pct numeric not null check (discount_pct > 0 and discount_pct <= 15),
  min_points int default 0, seats int, deadline date
);
create table public.psychologist_interests (psychologist_id uuid references public.psychologist_profiles(id) on delete cascade, area text not null, opportunity_id uuid references public.scholarship_opportunities(id), created_at timestamptz default now(), primary key (psychologist_id, area));
create table public.points_ledger (id uuid primary key default gen_random_uuid(), psychologist_id uuid not null references public.psychologist_profiles(id) on delete cascade, delta int not null, reason text not null, created_at timestamptz default now());
create view public.leaderboard with (security_invoker = on) as
  select p.id as psychologist_id, pr.display_name, coalesce(sum(l.delta),0) as points
  from public.psychologist_profiles p join public.profiles pr on pr.id = p.id
  left join public.points_ledger l on l.psychologist_id = p.id
  where p.is_public group by p.id, pr.display_name;
create table public.support_requests (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), category text not null, status text not null default 'open', message text, created_at timestamptz default now());
create table public.consents (user_id uuid references auth.users(id) on delete cascade, key text not null, granted boolean not null, updated_at timestamptz default now(), primary key (user_id, key));
create table public.audit_events (id uuid primary key default gen_random_uuid(), actor uuid, action text not null, target text, created_at timestamptz default now());

-- Grants
grant select on public.specialties, public.languages, public.psychologist_profiles, public.psychologist_specialties, public.psychologist_languages, public.availability, public.universities, public.scholarship_opportunities, public.points_ledger, public.leaderboard to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant all on all tables in schema public to service_role;

-- RLS
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.psychologist_profiles enable row level security;
alter table public.psychologist_verifications enable row level security;
alter table public.refugee_profiles enable row level security;
alter table public.appointments enable row level security;
alter table public.consents enable row level security;
alter table public.support_requests enable row level security;
alter table public.audit_events enable row level security;
alter table public.points_ledger enable row level security;
alter table public.scholarship_opportunities enable row level security;
alter table public.availability enable row level security;

create policy "own profile" on public.profiles for all to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "public verified psychologists" on public.psychologist_profiles for select to anon, authenticated using (is_public);
create policy "own psychologist profile" on public.psychologist_profiles for all to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "own verification read" on public.psychologist_verifications for select to authenticated using (psychologist_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own verification submit" on public.psychologist_verifications for insert to authenticated with check (psychologist_id = auth.uid() and status = 'pending');
create policy "admin verification review" on public.psychologist_verifications for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "own refugee profile" on public.refugee_profiles for all to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "participants read appointments" on public.appointments for select to authenticated using (psychologist_id = auth.uid() or refugee_id = auth.uid());
create policy "refugee requests appointment" on public.appointments for insert to authenticated with check (refugee_id = auth.uid() and status = 'requested');
create policy "psychologist manages appointment" on public.appointments for update to authenticated using (psychologist_id = auth.uid());
create policy "own consents" on public.consents for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "create support" on public.support_requests for insert to authenticated with check (user_id = auth.uid());
create policy "staff read support" on public.support_requests for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'moderator') or public.has_role(auth.uid(),'admin'));
create policy "admin audit" on public.audit_events for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "public points" on public.points_ledger for select to anon, authenticated using (true);  -- writes only via service_role
create policy "public opportunities" on public.scholarship_opportunities for select to anon, authenticated using (true);
create policy "partner manages opportunities" on public.scholarship_opportunities for all to authenticated
  using (exists (select 1 from public.universities u where u.id = university_id and u.owner_id = auth.uid()));
create policy "public availability" on public.availability for select to anon, authenticated using (true);
create policy "own availability" on public.availability for all to authenticated using (psychologist_id = auth.uid()) with check (psychologist_id = auth.uid());
