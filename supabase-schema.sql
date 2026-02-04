-- ============================================================
-- MENU3D – Schema Supabase
-- Copier dans : Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── restaurants ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.restaurants (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                TEXT        UNIQUE NOT NULL,
  name                TEXT        NOT NULL,
  logo_url            TEXT,
  hero_image_url      TEXT,
  primary_color       TEXT        NOT NULL DEFAULT '#1a1a1a',
  accent_color        TEXT        NOT NULL DEFAULT '#c9a84c',
  font_display        TEXT        NOT NULL DEFAULT 'Cormorant Garamond',
  font_body           TEXT        NOT NULL DEFAULT 'DM Sans',
  template            TEXT        NOT NULL DEFAULT 'classic'
                                  CHECK (template IN ('classic','modern','boutique','casual')),
  address             TEXT,
  phone               TEXT,
  email               TEXT,
  hours               TEXT,
  website_url         TEXT,
  plan                TEXT        NOT NULL DEFAULT 'free'
                                  CHECK (plan IN ('free','starter','premium','pro')),
  subscription_active BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── categories ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id   UUID        NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  icon            TEXT,
  display_order   INT         NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── dishes ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.dishes (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id       UUID        NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  category_id         UUID        REFERENCES public.categories(id) ON DELETE SET NULL,
  name                TEXT        NOT NULL,
  description         TEXT,
  price               NUMERIC(10,2) NOT NULL,
  image_url           TEXT,
  model_3d_url        TEXT,
  model_ar_ios_url    TEXT,
  has_ar              BOOLEAN     NOT NULL DEFAULT FALSE,
  tags                TEXT[]      NOT NULL DEFAULT '{}',
  allergens           TEXT[]      NOT NULL DEFAULT '{}',
  is_visible          BOOLEAN     NOT NULL DEFAULT TRUE,
  display_order       INT         NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Index ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_cat_rest    ON public.categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_dish_rest   ON public.dishes(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_dish_cat    ON public.dishes(category_id);
CREATE INDEX IF NOT EXISTS idx_dish_vis    ON public.dishes(restaurant_id, is_visible);
CREATE INDEX IF NOT EXISTS idx_rest_slug   ON public.restaurants(slug);

-- ─── Trigger updated_at ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_rest_upd  ON public.restaurants;
DROP TRIGGER IF EXISTS trg_dish_upd  ON public.dishes;
CREATE TRIGGER trg_rest_upd  BEFORE UPDATE ON public.restaurants  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_dish_upd  BEFORE UPDATE ON public.dishes       FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── RLS ────────────────────────────────────────────────────
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes      ENABLE ROW LEVEL SECURITY;

-- Lecture publique
CREATE POLICY "rest_read"  ON public.restaurants FOR SELECT USING (subscription_active = TRUE);
CREATE POLICY "cat_read"   ON public.categories  FOR SELECT USING (restaurant_id IN (SELECT id FROM public.restaurants WHERE subscription_active));
CREATE POLICY "dish_read"  ON public.dishes      FOR SELECT USING (is_visible AND restaurant_id IN (SELECT id FROM public.restaurants WHERE subscription_active));

-- Écriture via Service Role (bypass RLS automatique) – utilisé par l'admin Next.js

-- ─── DONNÉES DEMO ───────────────────────────────────────────
INSERT INTO public.restaurants (slug, name, primary_color, accent_color, template, address, phone, hours, plan, subscription_active)
VALUES (
  'la-brasserie-demo',
  'La Brasserie Élégante',
  '#1a1a1a', '#c9a84c', 'classic',
  '63 Boulevard Paul Vaillant-Couturier, 75014 Paris',
  '01 23 45 67 89',
  'Lun–Ven 12h–23h | Sam–Dim 12h–00h',
  'premium', TRUE
) ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
  rid  UUID;
  c_en UUID; c_pl UUID; c_de UUID; c_bo UUID;
BEGIN
  SELECT id INTO rid FROM public.restaurants WHERE slug = 'la-brasserie-demo';

  INSERT INTO public.categories (restaurant_id, name, icon, display_order)
  VALUES (rid,'Entrées','🥗',0),(rid,'Plats','🍝',1),(rid,'Desserts','🍰',2),(rid,'Boissons','🍷',3)
  ON CONFLICT DO NOTHING;

  SELECT id INTO c_en FROM public.categories WHERE restaurant_id = rid AND name = 'Entrées';
  SELECT id INTO c_pl FROM public.categories WHERE restaurant_id = rid AND name = 'Plats';
  SELECT id INTO c_de FROM public.categories WHERE restaurant_id = rid AND name = 'Desserts';

  INSERT INTO public.dishes (restaurant_id, category_id, name, description, price, tags, has_ar, is_visible, display_order)
  VALUES
    (rid, c_en, 'Tartare de Saumon',    'Saumon frais mariné aux agrumes, avocat, concombre, mangue, sauce soja yuzu.',                          16.90, ARRAY['Frais','Signature'],  TRUE,  TRUE, 0),
    (rid, c_pl, 'Burger Signature',     'Steak haché Black Angus 200g, cheddar affiné, sauce maison, roquette, tomate cœur de bœuf.',           18.90, ARRAY['Signature','Nouveauté'], TRUE,  TRUE, 0),
    (rid, c_pl, 'Pizza Tartufo',        'Crème de truffe noire, mozzarella fior di latte, champignons forestiers, parmesan 24 mois.',            22.50, ARRAY['Premium'],           TRUE,  TRUE, 1),
    (rid, c_pl, 'Risotto aux Cèpes',    'Riz Carnaroli, cèpes frais, bouillon maison, parmesan Parmigiano Reggiano, beurre de baratte.',         19.50, ARRAY['Végétarien'],       FALSE, TRUE, 2),
    (rid, c_pl, 'Pâtes Carbonara',      'Spaghetti artisanaux, guanciale croustillant, jaune d''œuf, pecorino romano, poivre noir.',             16.50, ARRAY['Classique'],        TRUE,  TRUE, 3),
    (rid, c_de, 'Tiramisu Traditionnel','Mascarpone italien, amaretti imbibés d''espresso Illy, cacao Valrhona, recette familiale.',              8.90, ARRAY['Fait Maison'],      TRUE,  TRUE, 0),
    (rid, c_de, 'Crème Brûlée Vanille', 'Crème onctueuse vanille Madagascar, caramélisée au chalumeau, sablé breton maison.',                    7.50, ARRAY['Classique'],       FALSE, TRUE, 1)
  ON CONFLICT DO NOTHING;
END $$;
