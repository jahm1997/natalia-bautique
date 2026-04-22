
/*
  # Admin Read Policies + Storage Bucket

  1. Changes
    - Add SELECT policies for authenticated admins to see ALL brands/products (including inactive)
    - Create storage bucket for boutique images
    - Add storage policies for admin upload/read

  2. Why
    - Current RLS only lets public read ACTIVE records, but admins need to see everything
    - Need image upload capability via Supabase Storage
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'brands' AND policyname = 'Admin read all brands'
  ) THEN
    CREATE POLICY "Admin read all brands"
      ON brands FOR SELECT
      TO authenticated
      USING (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admin read all products'
  ) THEN
    CREATE POLICY "Admin read all products"
      ON products FOR SELECT
      TO authenticated
      USING (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Admin read all categories'
  ) THEN
    CREATE POLICY "Admin read all categories"
      ON categories FOR SELECT
      TO authenticated
      USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'boutique-images',
  'boutique-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Public read boutique images'
  ) THEN
    CREATE POLICY "Public read boutique images"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'boutique-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Admin upload boutique images'
  ) THEN
    CREATE POLICY "Admin upload boutique images"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'boutique-images' AND auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Admin delete boutique images'
  ) THEN
    CREATE POLICY "Admin delete boutique images"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'boutique-images' AND auth.uid() IS NOT NULL);
  END IF;
END $$;
