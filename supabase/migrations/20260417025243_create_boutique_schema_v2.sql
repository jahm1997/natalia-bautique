
/*
  # Natalia Boutique - Schema v2

  Crea tablas con RLS y datos iniciales de marcas y categorías.
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text DEFAULT '',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  cover_image text DEFAULT '',
  description text DEFAULT '',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(12,0) DEFAULT 20000,
  image_url text DEFAULT '',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Public read categories') THEN
    CREATE POLICY "Public read categories" ON categories FOR SELECT USING (sort_order >= 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'brands' AND policyname = 'Public read active brands') THEN
    CREATE POLICY "Public read active brands" ON brands FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Public read active products') THEN
    CREATE POLICY "Public read active products" ON products FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Admin insert categories') THEN
    CREATE POLICY "Admin insert categories" ON categories FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Admin update categories') THEN
    CREATE POLICY "Admin update categories" ON categories FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Admin delete categories') THEN
    CREATE POLICY "Admin delete categories" ON categories FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'brands' AND policyname = 'Admin insert brands') THEN
    CREATE POLICY "Admin insert brands" ON brands FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'brands' AND policyname = 'Admin update brands') THEN
    CREATE POLICY "Admin update brands" ON brands FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'brands' AND policyname = 'Admin delete brands') THEN
    CREATE POLICY "Admin delete brands" ON brands FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admin insert products') THEN
    CREATE POLICY "Admin insert products" ON products FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admin update products') THEN
    CREATE POLICY "Admin update products" ON products FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admin delete products') THEN
    CREATE POLICY "Admin delete products" ON products FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Bolsos', 'bolsos', '👜', 1),
  ('Maquillaje', 'maquillaje', '💄', 2),
  ('Accesorios', 'accesorios', '✨', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO brands (name, slug, category_id, cover_image, description, sort_order)
SELECT name, slug, (SELECT id FROM categories WHERE slug = 'bolsos'), cover_image, description, sort_order
FROM (VALUES
  ('CAJITA COMBINICH', 'cajita-combinich', 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800', 'Elegante cajita combinich, diseño exclusivo', 1),
  ('CARRIEL CHANEL', 'carriel-chanel', 'https://images.pexels.com/photos/1204459/pexels-photo-1204459.jpeg?auto=compress&cs=tinysrgb&w=800', 'Carriel inspirado en Chanel, lujo y estilo', 2),
  ('REF BELLA', 'ref-bella', 'https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg?auto=compress&cs=tinysrgb&w=800', 'Referencia Bella, bolso elegante y versátil', 3),
  ('REF BIRKIN', 'ref-birkin', 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=800', 'Referencia Birkin, icono de la moda', 4),
  ('REF CHANEL KERCHIEF', 'ref-chanel-kerchief', 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800', 'Referencia Chanel Kerchief, sofisticación pura', 5),
  ('REF COLORS', 'ref-colors', 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800', 'Colección Colors, variedad de tonos', 6),
  ('REF ELEGANT LV', 'ref-elegant-lv', 'https://images.pexels.com/photos/1204459/pexels-photo-1204459.jpeg?auto=compress&cs=tinysrgb&w=800', 'Referencia Elegant LV, distinción y clase', 7),
  ('REF GABRIELA VELEZ', 'ref-gabriela-velez', 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800', 'Inspirado en Gabriela Vélez, diseño colombiano', 8),
  ('REF GUCCI', 'ref-gucci', 'https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg?auto=compress&cs=tinysrgb&w=800', 'Referencia Gucci, moda italiana', 9),
  ('REF LV BEEL', 'ref-lv-beel', 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800', 'Referencia LV Beel, colección premium', 10),
  ('REF LV LULU', 'ref-lv-lulu', 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=800', 'Referencia LV Lulu, elegancia en cada detalle', 11),
  ('REF LV SOIT', 'ref-lv-soit', 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800', 'Referencia LV Soit, línea de lujo', 12),
  ('REF MALASIA', 'ref-malasia', 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800', 'Referencia Malasia, exotismo y estilo', 13),
  ('REF PERLA', 'ref-perla', 'https://images.pexels.com/photos/1204459/pexels-photo-1204459.jpeg?auto=compress&cs=tinysrgb&w=800', 'Referencia Perla, delicadeza y feminidad', 14),
  ('REF TRIOS LV', 'ref-trios-lv', 'https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg?auto=compress&cs=tinysrgb&w=800', 'Referencia Tríos LV, sets exclusivos', 15),
  ('REF VINTAGE', 'ref-vintage', 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800', 'Referencia Vintage, clásicos atemporales', 16)
) AS t(name, slug, cover_image, description, sort_order)
ON CONFLICT (slug) DO NOTHING;
