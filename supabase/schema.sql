-- ============================================================
--  GRILLCHI — Supabase schema
--  Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Branches
create table if not exists branches (
  id          text primary key,
  open        boolean not null default true,
  hours       text not null,
  sort_order  integer not null default 0,
  name_en     text not null, name_fa text not null, name_ar text not null,
  city_en     text not null, city_fa text not null, city_ar text not null,
  dist_en     text not null, dist_fa text not null, dist_ar text not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Categories
create table if not exists categories (
  id          text primary key,
  icon_paths  text not null,
  sort_order  integer not null default 0,
  name_en     text not null, name_fa text not null, name_ar text not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Dishes
create table if not exists dishes (
  id            text primary key,
  category_id   text not null references categories(id) on delete restrict,
  price         integer not null,
  featured      boolean not null default false,
  trending      boolean not null default false,
  kcal          integer,
  mins          integer,
  hot           integer not null default 0 check (hot >= 0 and hot <= 3),
  available     boolean not null default true,
  sort_order    integer not null default 0,
  image_url     text,
  name_en       text not null, name_fa text not null, name_ar text not null,
  desc_en       text, desc_fa text, desc_ar text,
  ing_en        jsonb default '[]'::jsonb,
  ing_fa        jsonb default '[]'::jsonb,
  ing_ar        jsonb default '[]'::jsonb,
  tags          text[] default '{}',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists dishes_category_id_idx on dishes(category_id);
create index if not exists dishes_featured_idx on dishes(featured) where featured = true;
create index if not exists dishes_trending_idx on dishes(trending) where trending = true;

-- Promos
create table if not exists promos (
  id              text primary key,
  dish_id         text references dishes(id) on delete set null,
  sort_order      integer not null default 0,
  active          boolean not null default true,
  gradient_class  text not null default 'p0',
  kicker_en text not null, kicker_fa text not null, kicker_ar text not null,
  title_en  text not null, title_fa  text not null, title_ar  text not null,
  cta_en    text not null, cta_fa    text not null, cta_ar    text not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Brand settings (singleton)
create table if not exists brand_settings (
  id            integer primary key default 1 check (id = 1),
  logo_url      text,
  name_en       text not null default 'GRILLCHI',
  name_fa       text not null default 'گریلچی',
  name_ar       text not null default 'غريلتشي',
  tagline_en    text not null default 'Fire-grilled, beautifully served',
  tagline_fa    text not null default 'غذای اصیل، روی آتش',
  tagline_ar    text not null default 'مشويات على الفحم، بإتقان',
  accent_color  text not null default '#b8d9a0',
  updated_at    timestamptz default now()
);
insert into brand_settings (id) values (1) on conflict do nothing;

-- ============================================================
--  Row Level Security
-- ============================================================
alter table branches       enable row level security;
alter table categories     enable row level security;
alter table dishes         enable row level security;
alter table promos         enable row level security;
alter table brand_settings enable row level security;

-- Public read
create policy "public read branches"       on branches       for select to anon, authenticated using (true);
create policy "public read categories"     on categories     for select to anon, authenticated using (true);
create policy "public read available"      on dishes         for select to anon, authenticated using (available = true);
create policy "public read active promos"  on promos         for select to anon, authenticated using (active = true);
create policy "public read brand"          on brand_settings for select to anon, authenticated using (true);

-- Authenticated admin: full access
create policy "admin all branches"    on branches       for all to authenticated using (true) with check (true);
create policy "admin all categories"  on categories     for all to authenticated using (true) with check (true);
create policy "admin all dishes"      on dishes         for all to authenticated using (true) with check (true);
create policy "admin all promos"      on promos         for all to authenticated using (true) with check (true);
create policy "admin all brand"       on brand_settings for all to authenticated using (true) with check (true);

-- ============================================================
--  Storage: menu-images bucket (create manually in dashboard,
--  then run these policies)
-- ============================================================
create policy "public read menu images"
  on storage.objects for select
  using (bucket_id = 'menu-images');

create policy "admin upload menu images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'menu-images');

create policy "admin delete menu images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'menu-images');
