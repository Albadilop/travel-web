-- Create storage bucket for city images (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('city-images', 'city-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for city images (if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can view all city images'
  ) THEN
    CREATE POLICY "Users can view all city images" 
    ON storage.objects 
    FOR SELECT 
    USING (bucket_id = 'city-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload their own city images'
  ) THEN
    CREATE POLICY "Users can upload their own city images" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (bucket_id = 'city-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update their own city images'
  ) THEN
    CREATE POLICY "Users can update their own city images" 
    ON storage.objects 
    FOR UPDATE 
    USING (bucket_id = 'city-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete their own city images'
  ) THEN
    CREATE POLICY "Users can delete their own city images" 
    ON storage.objects 
    FOR DELETE 
    USING (bucket_id = 'city-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;