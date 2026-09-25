-- ============================================================
-- ReNova — Admin-only writes (RLS hardening migration)
-- Run ONCE in the Supabase Dashboard → SQL Editor (as project owner).
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS /
-- DROP POLICY IF EXISTS / ON CONFLICT DO NOTHING).
--
-- What it does (no data touched, no schema recreated):
--   1. Creates public.admins allow-list (user_id PK). RLS enabled with
--      NO policies for anon/authenticated, so only the owner/service_role
--      can read or modify it. Authenticated users CANNOT grant themselves
--      admin.
--   2. Bootstraps the allow-list from auth.users by admin email.
--   3. Creates SECURITY DEFINER public.is_admin() which checks
--      auth.uid() (trusted JWT subject, NOT user_metadata) against the
--      allow-list.
--   4. Replaces the broad "FOR ALL TO authenticated USING (true)" write
--      policies on products/categories with per-operation admin-only
--      policies. Public (anon + authenticated) SELECT policies unchanged.
--   5. Replaces the broad storage manage policy with per-operation
--      admin-only policies on the product-images bucket. Public read
--      policy unchanged.
--
-- Verify after running: the final SELECT must return admin_count = 1.
-- ============================================================

-- ---------- 1. Admin allow-list ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Intentionally NO policies for anon/authenticated on public.admins:
-- default-deny means only the table owner / service_role bypass RLS.
-- (DROP any stray permissive policy if this script is re-run after edits.)
drop policy if exists "admins deny all" on public.admins;

-- ---------- 2. Bootstrap admin from Auth (owner privilege reads auth.users) ----------
insert into public.admins (user_id)
select id from auth.users where lower(email) = lower('admin@renova.demo')
on conflict (user_id) do nothing;

-- ---------- 3. Admin check (never reads user_metadata) ----------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;

-- ---------- 4a. Products: replace broad write policy with admin-only ----------
drop policy if exists "admin write products" on public.products;

drop policy if exists "admin insert products" on public.products;
create policy "admin insert products"
  on public.products for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin update products" on public.products;
create policy "admin update products"
  on public.products for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin delete products" on public.products;
create policy "admin delete products"
  on public.products for delete to authenticated
  using (public.is_admin());

-- ---------- 4b. Categories: replace broad write policy with admin-only ----------
drop policy if exists "admin write categories" on public.categories;

drop policy if exists "admin insert categories" on public.categories;
create policy "admin insert categories"
  on public.categories for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin update categories" on public.categories;
create policy "admin update categories"
  on public.categories for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin delete categories" on public.categories;
create policy "admin delete categories"
  on public.categories for delete to authenticated
  using (public.is_admin());

-- ---------- 5. Storage product-images: replace broad manage policy ----------
-- Public SELECT policy ("public read product images") is left untouched.
drop policy if exists "admin manage product images" on storage.objects;

drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- ---------- 6. Verify (must return admin_count = 1) ----------
select count(*) as admin_count from public.admins;
