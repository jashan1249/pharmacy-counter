-- Pharmacy Counter: Supabase database setup
-- Paste this whole file into Supabase > SQL Editor > New query, then press Run.
-- Safe to run again: it only creates what is missing and replaces functions/policies.

-- ---------------------------------------------------------------
-- 1. Shop profiles (one per login). Holds counts only, never patient data.
-- ---------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  shop_name   text not null default '',
  phone       text not null default '',
  city        text not null default '',
  plan        text not null default 'free' check (plan in ('free','pro')),
  created_at  timestamptz not null default now(),
  last_seen   timestamptz,
  bills_count integer not null default 0,
  meds_count  integer not null default 0,
  app_version text
);

-- ---------------------------------------------------------------
-- 2. Shop data: the whole shop record (bills, stock, customers) as one JSON document.
--    Only the shop's own login can read or write it. Admins cannot read it.
-- ---------------------------------------------------------------
create table if not exists public.shop_data (
  shop_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  device     text
);

-- 3. Daily cloud copies (last 14 days kept), so a bad sync can be undone.
create table if not exists public.shop_backups (
  shop_id    uuid not null references auth.users(id) on delete cascade,
  day        date not null,
  data       jsonb not null,
  created_at timestamptz not null default now(),
  primary key (shop_id, day)
);

-- 4. Admins (you). Add your email after you sign up:
--    insert into public.admins(email) values ('you@example.com');
create table if not exists public.admins (
  email text primary key
);

-- ---------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- New login -> profile row, filled from the sign-up form.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, shop_name, phone, city)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'shop_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'city', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Admin-only: change a shop's plan.
create or replace function public.set_plan(target uuid, new_plan text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'Only admins can change plans';
  end if;
  update public.profiles set plan = new_plan where id = target;
end;
$$;

-- Keep only the newest 14 daily copies per shop.
create or replace function public.trim_backups() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  delete from public.shop_backups b
  where b.shop_id = new.shop_id
    and b.day < (select min(day) from (
      select day from public.shop_backups where shop_id = new.shop_id order by day desc limit 14
    ) k);
  return new;
end;
$$;

drop trigger if exists trim_backups_after_insert on public.shop_backups;
create trigger trim_backups_after_insert
  after insert on public.shop_backups
  for each row execute function public.trim_backups();

-- ---------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------
alter table public.profiles     enable row level security;
alter table public.shop_data    enable row level security;
alter table public.shop_backups enable row level security;
alter table public.admins       enable row level security;

drop policy if exists "own profile or admin can read" on public.profiles;
create policy "own profile or admin can read" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "own shop data" on public.shop_data;
create policy "own shop data" on public.shop_data
  for all to authenticated using (shop_id = auth.uid()) with check (shop_id = auth.uid());

drop policy if exists "own backups" on public.shop_backups;
create policy "own backups" on public.shop_backups
  for all to authenticated using (shop_id = auth.uid()) with check (shop_id = auth.uid());

drop policy if exists "admins see admins" on public.admins;
create policy "admins see admins" on public.admins
  for select to authenticated using (public.is_admin());

-- Shops may update their own details and usage counts, but never their plan.
revoke update on public.profiles from authenticated, anon;
grant update (shop_name, phone, city, last_seen, bills_count, meds_count, app_version)
  on public.profiles to authenticated;
grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.shop_data, public.shop_backups to authenticated;
grant select on public.admins to authenticated;
revoke all on public.profiles, public.shop_data, public.shop_backups, public.admins from anon;
grant execute on function public.set_plan(uuid, text) to authenticated;
grant execute on function public.is_admin() to authenticated;
