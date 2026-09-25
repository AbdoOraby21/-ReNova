-- ============================================================
-- ReNova — Real marketplace transactions (orders foundation)
-- Run ONCE in the Supabase Dashboard → SQL Editor (as project owner),
-- AFTER supabase/migrations/20260925_admin_only_writes.sql.
-- Safe to re-run: idempotent (IF NOT EXISTS / DROP POLICY IF EXISTS).
--
-- What it does (no existing data touched):
--   1. Creates public.orders + public.order_items (empty — NO seed rows,
--      NO historical backfill; initial state is zero orders/revenue).
--   2. Enables RLS with customer-owned + admin-only policies built on the
--      existing public.is_admin() allow-list. No change to products,
--      categories, public.admins, is_admin(), or storage policies.
--
-- Security model:
--   - anon: NO access to orders/order_items at all.
--   - authenticated customer: INSERT own orders/items; SELECT own rows.
--   - admin (allow-listed): full read/manage + aggregate reports.
--   - customers can never read other users' rows or aggregates.
-- ============================================================

-- ---------- 0. updated_at trigger helper (already in schema.sql; kept idempotent) ----------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------- 1. orders ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_user_id uuid not null,
  status text not null default 'جديد'
    check (status in ('جديد', 'قيد التجهيز', 'تم الشحن', 'مكتمل', 'ملغي')),
  total_amount numeric not null default 0 check (total_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_customer_idx on public.orders (customer_user_id);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------- 2. order_items (immutable snapshots; product may later be deleted) ----------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid,
  product_name text not null default '',
  product_category text not null default '',
  quantity integer not null check (quantity > 0),
  unit_price numeric not null default 0 check (unit_price >= 0),
  cost_price numeric not null default 0 check (cost_price >= 0),
  subtotal numeric not null default 0 check (subtotal >= 0)
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- ---------- 3. RLS ----------
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- orders: customers create their own; admin may create any
drop policy if exists "orders insert own" on public.orders;
create policy "orders insert own"
  on public.orders for insert to authenticated
  with check (customer_user_id = auth.uid() or public.is_admin());

-- orders: customers read own; admin reads all (reports)
drop policy if exists "orders select own or admin" on public.orders;
create policy "orders select own or admin"
  on public.orders for select to authenticated
  using (customer_user_id = auth.uid() or public.is_admin());

-- orders: admin-only updates/deletes (status management, corrections)
drop policy if exists "orders admin update" on public.orders;
create policy "orders admin update"
  on public.orders for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "orders admin delete" on public.orders;
create policy "orders admin delete"
  on public.orders for delete to authenticated
  using (public.is_admin());

-- order_items: insert only alongside an order the caller owns (or admin)
drop policy if exists "order_items insert own order" on public.order_items;
create policy "order_items insert own order"
  on public.order_items for insert to authenticated
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.customer_user_id = auth.uid() or public.is_admin())
    )
  );

-- order_items: read only within visible orders (or admin)
drop policy if exists "order_items select own order or admin" on public.order_items;
create policy "order_items select own order or admin"
  on public.order_items for select to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.customer_user_id = auth.uid() or public.is_admin())
    )
  );

-- order_items: admin-only updates/deletes
drop policy if exists "order_items admin update" on public.order_items;
create policy "order_items admin update"
  on public.order_items for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "order_items admin delete" on public.order_items;
create policy "order_items admin delete"
  on public.order_items for delete to authenticated
  using (public.is_admin());

-- ---------- 4. Verify (fresh install must return 0 / 0) ----------
select count(*) as orders_count from public.orders;
select count(*) as order_items_count from public.order_items;
