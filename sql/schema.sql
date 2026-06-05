-- Grillchi — schema for Liara PostgreSQL 18
-- Run ONCE against the database. Idempotent (safe to re-run).

CREATE TABLE IF NOT EXISTS categories (
  id          text PRIMARY KEY,
  icon_paths  text    NOT NULL DEFAULT '',
  sort_order  integer NOT NULL DEFAULT 0,
  name_en     text    NOT NULL,
  name_fa     text    NOT NULL,
  name_ar     text    NOT NULL
);

CREATE TABLE IF NOT EXISTS branches (
  id          text PRIMARY KEY,
  open        boolean NOT NULL DEFAULT true,
  hours       text    NOT NULL DEFAULT '',
  sort_order  integer NOT NULL DEFAULT 0,
  name_en text NOT NULL, name_fa text NOT NULL, name_ar text NOT NULL,
  city_en text NOT NULL, city_fa text NOT NULL, city_ar text NOT NULL,
  dist_en text NOT NULL, dist_fa text NOT NULL, dist_ar text NOT NULL
);

CREATE TABLE IF NOT EXISTS dishes (
  id          text PRIMARY KEY,
  category_id text    NOT NULL,
  price       numeric NOT NULL DEFAULT 0,
  featured    boolean NOT NULL DEFAULT false,
  trending    boolean NOT NULL DEFAULT false,
  home_hero   boolean NOT NULL DEFAULT false,
  kcal        integer,
  mins        integer,
  hot         integer NOT NULL DEFAULT 0,
  available   boolean NOT NULL DEFAULT true,
  sort_order  integer NOT NULL DEFAULT 0,
  image_url   text,
  name_en text NOT NULL, name_fa text NOT NULL, name_ar text NOT NULL,
  desc_en text, desc_fa text, desc_ar text,
  ing_en  text[] NOT NULL DEFAULT '{}',
  ing_fa  text[] NOT NULL DEFAULT '{}',
  ing_ar  text[] NOT NULL DEFAULT '{}',
  tags    text[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS promos (
  id             text PRIMARY KEY,
  dish_id        text,
  sort_order     integer NOT NULL DEFAULT 0,
  active         boolean NOT NULL DEFAULT true,
  gradient_class text    NOT NULL DEFAULT '',
  kicker_en text NOT NULL, kicker_fa text NOT NULL, kicker_ar text NOT NULL,
  title_en  text NOT NULL, title_fa  text NOT NULL, title_ar  text NOT NULL,
  cta_en    text NOT NULL, cta_fa    text NOT NULL, cta_ar    text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dishes_category  ON dishes (category_id);
CREATE INDEX IF NOT EXISTS idx_dishes_available ON dishes (available);
CREATE INDEX IF NOT EXISTS idx_dishes_sort      ON dishes (sort_order);
CREATE INDEX IF NOT EXISTS idx_promos_active    ON promos (active);

-- NOTE: your types.ts also has a BrandSettings interface. The original app
-- did NOT back it with a table (seed + reads only touch the 4 tables above),
-- so it is intentionally omitted. If your migrated code reads a brand_settings
-- table, tell me and I'll add it.
