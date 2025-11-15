-- First, enable realtime for the cities table
ALTER TABLE public.cities REPLICA IDENTITY FULL;

-- Add cities table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE cities;

-- Create city_images table for multiple images per city
CREATE TABLE public.city_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id uuid NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL
);

-- Enable RLS on city_images table
ALTER TABLE public.city_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for city_images
CREATE POLICY "Users can view their own city images" 
ON public.city_images 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own city images" 
ON public.city_images 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own city images" 
ON public.city_images 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own city images" 
ON public.city_images 
FOR DELETE 
USING (auth.uid() = user_id);

-- Remove the single image_url and image_count from cities table since we now have a separate table
ALTER TABLE public.cities DROP COLUMN image_url;
ALTER TABLE public.cities DROP COLUMN image_count;