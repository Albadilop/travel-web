-- Create storage bucket for city images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('city-images', 'city-images', true);

-- Create RLS policies for city images
CREATE POLICY "Users can view all city images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'city-images');

CREATE POLICY "Users can upload their own city images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'city-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own city images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'city-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own city images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'city-images' AND auth.uid()::text = (storage.foldername(name))[1]);