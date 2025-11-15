-- Create cities table for storing user's visited cities (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  visit_date DATE NOT NULL,
  comment TEXT,
  image_url TEXT,
  image_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Create policies for user access (if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'cities' 
    AND policyname = 'Users can view their own cities'
  ) THEN
    CREATE POLICY "Users can view their own cities" 
    ON public.cities 
    FOR SELECT 
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'cities' 
    AND policyname = 'Users can create their own cities'
  ) THEN
    CREATE POLICY "Users can create their own cities" 
    ON public.cities 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'cities' 
    AND policyname = 'Users can update their own cities'
  ) THEN
    CREATE POLICY "Users can update their own cities" 
    ON public.cities 
    FOR UPDATE 
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'cities' 
    AND policyname = 'Users can delete their own cities'
  ) THEN
    CREATE POLICY "Users can delete their own cities" 
    ON public.cities 
    FOR DELETE 
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates (if it doesn't exist)
DROP TRIGGER IF EXISTS update_cities_updated_at ON public.cities;
CREATE TRIGGER update_cities_updated_at
BEFORE UPDATE ON public.cities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_cities_user_id ON public.cities(user_id);
CREATE INDEX IF NOT EXISTS idx_cities_coordinates ON public.cities(latitude, longitude);