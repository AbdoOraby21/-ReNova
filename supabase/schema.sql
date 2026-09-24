-- ============================================================
-- ReNova — Products backend (Supabase)
-- Run this file once in the Supabase SQL Editor (in order).
-- It creates tables, RLS policies, Storage bucket + policies,
-- e-waste categories, and realistic seed products.
-- ============================================================

-- ---------- Categories ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- ---------- Products ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text not null default '',
  price numeric not null default 0 check (price >= 0),
  condition text not null default 'مُجدد - ممتاز',
  status text not null default 'published',
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_status_idx on public.products (status);
create index if not exists products_created_at_idx on public.products (created_at desc);

-- Keep updated_at fresh on every edit
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------- Row Level Security ----------
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- Public (anon + authenticated) can READ published catalog
drop policy if exists "public read categories" on public.categories;
create policy "public read categories"
  on public.categories for select to anon, authenticated using (true);

drop policy if exists "public read products" on public.products;
create policy "public read products"
  on public.products for select to anon, authenticated using (true);

-- Only signed-in admins can WRITE (create an Auth user for the admin,
-- e.g. admin@renova.demo, and sign in from the Admin Dashboard)
drop policy if exists "admin write categories" on public.categories;
create policy "admin write categories"
  on public.categories for all to authenticated using (true) with check (true);

drop policy if exists "admin write products" on public.products;
create policy "admin write products"
  on public.products for all to authenticated using (true) with check (true);

-- ---------- Storage: product-images bucket ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Public can view product images
drop policy if exists "public read product images" on storage.objects;
create policy "public read product images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-images');

-- Signed-in admins can upload / replace / delete product images
drop policy if exists "admin manage product images" on storage.objects;
create policy "admin manage product images"
  on storage.objects for all to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

-- ---------- Seed: e-waste categories ----------
insert into public.categories (name) values
  ('أجهزة كمبيوتر وقطع PC'),
  ('لابتوبات'),
  ('هواتف ذكية وتابلت'),
  ('شاشات'),
  ('لوحات أم ودوائر إلكترونية'),
  ('كروت شاشة ومعالجات'),
  ('رامات وتخزين'),
  ('كابلات وشواحن'),
  ('مكونات إلكترونية'),
  ('أجهزة مُجددة'),
  ('خامات مُستعادة قابلة لإعادة الاستخدام')
on conflict (name) do nothing;

-- ---------- Seed: realistic e-waste products ----------
-- (Normal 2D product photos via Unsplash CDN; rows live in the DB,
--  so they are NOT mock data — edit/delete them from the Admin Dashboard.)
insert into public.products (name, category, description, price, condition, status, image_url) values
  ('لابتوب مُجدد — Core i5 / رام 8GB / تخزين 256GB SSD',
   'لابتوبات',
   'لابتوب تم فحصه وتجديده بالكامل: بطارية بحالة جيدة، ويندوز مُثبت، وضمان فحص شامل قبل البيع.',
   8500, 'مُجدد - ممتاز', 'published',
   'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop'),
  ('هاتف ذكي مُجدد — شاشة سليمة وبطارية 85%+',
   'هواتف ذكية وتابلت',
   'هاتف مستعمل تم اختباره: شاشة بدون كسور، بطارية بكفاءة عالية، وتمت إعادة ضبط المصنع.',
   4200, 'مُجدد - ممتاز', 'published',
   'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop'),
  ('لوحة أم مستعملة — سليمة وتعمل',
   'لوحات أم ودوائر إلكترونية',
   'لوحة أم مفكوكة من جهاز يعمل، تم اختبار منافذها. مناسبة للصيانة أو الاستعادة.',
   1200, 'مستعمل - جيد', 'published',
   'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'),
  ('كارت شاشة مستعمل — تم تنظيفه واختباره',
   'كروت شاشة ومعالجات',
   'كارت شاشة مستعمل بحالة تشغيل مستقرة، تم تنظيف المراوح وتغيير المعجون الحراري واختباره تحت الضغط.',
   5500, 'مستعمل - جيد', 'published',
   'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop'),
  ('شاشة كمبيوتر 24 بوصة — تعمل بدون عيوب',
   'شاشات',
   'شاشة مستعملة بدون خطوط أو بيكسلات ميتة، تشمل كابل الطاقة وكابل العرض.',
   2800, 'مستعمل - جيد', 'published',
   'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop'),
  ('ماوس وكيبورد — طقم مكتبي مُختبر',
   'أجهزة كمبيوتر وقطع PC',
   'طقم ماوس وكيبورد مستعمل تم تنظيفه واختبار كل الأزرار. مثالي لمحطات العمل.',
   350, 'مستعمل - جيد', 'published',
   'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop'),
  ('رام DDR4 بسعة 8GB — مختبرة',
   'رامات وتخزين',
   'قطعة رام مختبرة ببرامج فحص الذاكرة وتعمل باستقرار. مناسبة لترقية الأجهزة القديمة.',
   600, 'مستعمل - جيد', 'published',
   'https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=800&auto=format&fit=crop'),
  ('جهاز كمبيوتر مكتبي مُجدد — Core i5 / رام 8GB / تخزين 512GB',
   'أجهزة كمبيوتر وقطع PC',
   'جهاز مكتبي تم تجديده واختباره: تم تنظيفه من الداخل، وفحص مكوناته، وهو جاهز للعمل المكتبي والدراسة.',
   6500, 'مُجدد - ممتاز', 'published',
   'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=800&auto=format&fit=crop'),
  ('تشكيلة كابلات وشواحن أصلية مستعملة',
   'كابلات وشواحن',
   'مجموعة كابلات شحن وبيانات وشواحن أصلية مختبرة. تُباع كحزمة لتقليل النفايات الإلكترونية.',
   250, 'مستعمل - جيد', 'published',
   'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop'),
  ('مكونات إلكترونية للقطع والاستعادة',
   'مكونات إلكترونية',
   'لوحات ودوائر ومكونات غير صالحة للتشغيل المباشر، مخصصة لاستعادة المعادن والمكونات.',
   150, 'للقطع والاستعادة', 'published',
   'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=800&auto=format&fit=crop');
