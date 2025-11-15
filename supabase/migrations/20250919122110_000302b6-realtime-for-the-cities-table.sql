-- First, enable realtime for the cities table (only if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'cities'
  ) THEN
    -- Set REPLICA IDENTITY FULL for realtime
    ALTER TABLE public.cities REPLICA IDENTITY FULL;
  END IF;
END $$;

-- Add cities table to realtime publication (if not already added)
DO $$
BEGIN
  -- Check if table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'cities'
  ) THEN
    -- Check if publication exists and table is not already in it
    IF EXISTS (
      SELECT 1 FROM pg_publication 
      WHERE pubname = 'supabase_realtime'
    ) AND NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public'
      AND tablename = 'cities'
    ) THEN
      -- Attempt to add table to publication
      -- This may fail if user doesn't have permission, but that's OK
      -- Supabase dashboard can be used to add tables to realtime
      BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.cities;
      EXCEPTION
        WHEN insufficient_privilege THEN
          -- User doesn't have permission, that's OK - use Supabase dashboard
          RAISE NOTICE 'Insufficient privileges to add cities to realtime publication. Add via Supabase dashboard if needed.';
        WHEN OTHERS THEN
          -- Any other error, log but don't fail migration
          RAISE NOTICE 'Note: Could not add cities to realtime publication automatically: %', SQLERRM;
      END;
    END IF;
  END IF;
END $$;

-- Create city_images table for multiple images per city (only if cities table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'cities'
  ) THEN
    -- Create city_images table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.city_images (
      id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      city_id uuid NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
      image_url text NOT NULL,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      user_id uuid NOT NULL
    );

    -- Enable RLS on city_images table
    ALTER TABLE public.city_images ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS policies for city_images (if they don't exist and table exists)
DO $$
BEGIN
  -- Only create policies if both cities and city_images tables exist
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'cities'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'city_images'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = 'city_images' 
      AND policyname = 'Users can view their own city images'
    ) THEN
      CREATE POLICY "Users can view their own city images" 
      ON public.city_images 
      FOR SELECT 
      USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = 'city_images' 
      AND policyname = 'Users can create their own city images'
    ) THEN
      CREATE POLICY "Users can create their own city images" 
      ON public.city_images 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = 'city_images' 
      AND policyname = 'Users can update their own city images'
    ) THEN
      CREATE POLICY "Users can update their own city images" 
      ON public.city_images 
      FOR UPDATE 
      USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = 'city_images' 
      AND policyname = 'Users can delete their own city images'
    ) THEN
      CREATE POLICY "Users can delete their own city images" 
      ON public.city_images 
      FOR DELETE 
      USING (auth.uid() = user_id);
    END IF;
  END IF;
END $$;

-- Remove the single image_url and image_count from cities table since we now have a separate table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'cities' 
    AND column_name = 'image_url'
  ) THEN
    ALTER TABLE public.cities DROP COLUMN image_url;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'cities' 
    AND column_name = 'image_count'
  ) THEN
    ALTER TABLE public.cities DROP COLUMN image_count;
  END IF;
END $$;