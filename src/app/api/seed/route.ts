import { NextResponse } from 'next/server'
import { BRANCHES, CATEGORIES, DISHES, PROMOS } from '@/lib/data/static'
import pool from '@/lib/db'

export async function POST() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    for (const c of CATEGORIES) {
      await client.query(
        `INSERT INTO categories (id,name_en,name_fa,name_ar,icon_paths,sort_order)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (id) DO UPDATE SET
           name_en=EXCLUDED.name_en, name_fa=EXCLUDED.name_fa, name_ar=EXCLUDED.name_ar,
           icon_paths=EXCLUDED.icon_paths, sort_order=EXCLUDED.sort_order`,
        [c.id, c.name_en, c.name_fa, c.name_ar, c.icon_paths, c.sort_order],
      )
    }

    for (const b of BRANCHES) {
      await client.query(
        `INSERT INTO branches
           (id,name_en,name_fa,name_ar,city_en,city_fa,city_ar,dist_en,dist_fa,dist_ar,open,hours,sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (id) DO UPDATE SET
           name_en=EXCLUDED.name_en, name_fa=EXCLUDED.name_fa, name_ar=EXCLUDED.name_ar,
           city_en=EXCLUDED.city_en, city_fa=EXCLUDED.city_fa, city_ar=EXCLUDED.city_ar,
           dist_en=EXCLUDED.dist_en, dist_fa=EXCLUDED.dist_fa, dist_ar=EXCLUDED.dist_ar,
           open=EXCLUDED.open, hours=EXCLUDED.hours, sort_order=EXCLUDED.sort_order`,
        [b.id, b.name_en, b.name_fa, b.name_ar,
         b.city_en, b.city_fa, b.city_ar,
         b.dist_en, b.dist_fa, b.dist_ar,
         b.open, b.hours, b.sort_order],
      )
    }

    for (const d of DISHES) {
      await client.query(
        `INSERT INTO dishes
           (id,category_id,name_en,name_fa,name_ar,desc_en,desc_fa,desc_ar,
            ing_en,ing_fa,ing_ar,price,kcal,mins,hot,tags,
            featured,trending,home_hero,available,image_url,sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
         ON CONFLICT (id) DO UPDATE SET
           category_id=EXCLUDED.category_id,
           name_en=EXCLUDED.name_en, name_fa=EXCLUDED.name_fa, name_ar=EXCLUDED.name_ar,
           desc_en=EXCLUDED.desc_en, desc_fa=EXCLUDED.desc_fa, desc_ar=EXCLUDED.desc_ar,
           ing_en=EXCLUDED.ing_en, ing_fa=EXCLUDED.ing_fa, ing_ar=EXCLUDED.ing_ar,
           price=EXCLUDED.price, kcal=EXCLUDED.kcal, mins=EXCLUDED.mins, hot=EXCLUDED.hot,
           tags=EXCLUDED.tags, featured=EXCLUDED.featured, trending=EXCLUDED.trending,
           home_hero=EXCLUDED.home_hero, available=EXCLUDED.available,
           image_url=EXCLUDED.image_url, sort_order=EXCLUDED.sort_order`,
        [d.id, d.category_id, d.name_en, d.name_fa, d.name_ar,
         d.desc_en ?? null, d.desc_fa ?? null, d.desc_ar ?? null,
         d.ing_en, d.ing_fa, d.ing_ar,
         d.price, d.kcal ?? null, d.mins ?? null, d.hot, d.tags,
         d.featured, d.trending, d.home_hero ?? false, d.available,
         null, // image_url — admin re-uploads after migration
         d.sort_order],
      )
    }

    for (const p of PROMOS) {
      await client.query(
        `INSERT INTO promos
           (id,dish_id,sort_order,active,gradient_class,
            kicker_en,kicker_fa,kicker_ar,title_en,title_fa,title_ar,cta_en,cta_fa,cta_ar)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         ON CONFLICT (id) DO UPDATE SET
           dish_id=EXCLUDED.dish_id, sort_order=EXCLUDED.sort_order, active=EXCLUDED.active,
           gradient_class=EXCLUDED.gradient_class,
           kicker_en=EXCLUDED.kicker_en, kicker_fa=EXCLUDED.kicker_fa, kicker_ar=EXCLUDED.kicker_ar,
           title_en=EXCLUDED.title_en, title_fa=EXCLUDED.title_fa, title_ar=EXCLUDED.title_ar,
           cta_en=EXCLUDED.cta_en, cta_fa=EXCLUDED.cta_fa, cta_ar=EXCLUDED.cta_ar`,
        [p.id, p.dish_id ?? null, p.sort_order, p.active, p.gradient_class,
         p.kicker_en, p.kicker_fa, p.kicker_ar,
         p.title_en, p.title_fa, p.title_ar,
         p.cta_en, p.cta_fa, p.cta_ar],
      )
    }

    await client.query('COMMIT')
    return NextResponse.json({
      ok: true,
      seeded: {
        categories: CATEGORIES.length,
        branches:   BRANCHES.length,
        dishes:     DISHES.length,
        promos:     PROMOS.length,
      },
    })
  } catch (e) {
    await client.query('ROLLBACK')
    return NextResponse.json({ error: String(e) }, { status: 500 })
  } finally {
    client.release()
  }
}
