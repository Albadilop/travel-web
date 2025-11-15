-- Seed data for Travel Web Application
-- This seed file populates the database with sample data for testing and development

-- ============================================
-- SEED FOR: profiles-table migration
-- ============================================
-- Insert profiles for existing users
INSERT INTO public.profiles (id, username, full_name, avatar_url, bio, location, website, birth_date, phone, preferences)
VALUES 
  (
    '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
    'traveler1',
    'Juan Pérez',
    NULL,
    'Apasionado por los viajes y la aventura. He visitado más de 30 países.',
    'Madrid, España',
    'https://juanperez.travel',
    '1990-05-15',
    '+34 600 123 456',
    '{"theme": "light", "notifications": true, "language": "es"}'::jsonb
  ),
  (
    '90140f28-583c-4f6e-b437-d0b48bfa0a32',
    'wanderlust',
    'María García',
    NULL,
    'Explorando el mundo una ciudad a la vez. Amante de la fotografía y la cultura.',
    'Barcelona, España',
    'https://mariagarcia.com',
    '1992-08-22',
    '+34 600 789 012',
    '{"theme": "dark", "notifications": true, "language": "es"}'::jsonb
  )
ON CONFLICT (id) DO UPDATE
SET 
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  website = EXCLUDED.website,
  birth_date = EXCLUDED.birth_date,
  phone = EXCLUDED.phone,
  preferences = EXCLUDED.preferences;

-- ============================================
-- SEED FOR: cities-table migration
-- ============================================
-- Insert sample cities for user 1 (Juan Pérez)
INSERT INTO public.cities (user_id, name, country, latitude, longitude, rating, visit_date, comment)
VALUES 
  (
    '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
    'París',
    'Francia',
    48.856614,
    2.3522219,
    5,
    '2023-06-15',
    'Una ciudad increíble con una arquitectura impresionante. La Torre Eiffel al atardecer es mágica.'
  ),
  (
    '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
    'Roma',
    'Italia',
    41.9027835,
    12.4963655,
    5,
    '2023-07-20',
    'La historia cobra vida en cada esquina. El Coliseo y el Vaticano son imprescindibles.'
  ),
  (
    '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
    'Tokio',
    'Japón',
    35.6761919,
    139.6503106,
    5,
    '2023-09-10',
    'Una mezcla perfecta de tradición y modernidad. La comida es excepcional.'
  ),
  (
    '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
    'Nueva York',
    'Estados Unidos',
    40.7127753,
    -74.0059728,
    4,
    '2023-11-05',
    'La ciudad que nunca duerme. Times Square es abrumador pero fascinante.'
  ),
  (
    '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
    'Londres',
    'Reino Unido',
    51.5073509,
    -0.1277583,
    4,
    '2024-03-12',
    'Lluvia típica pero la cultura y los museos compensan. El British Museum es increíble.'
  )
ON CONFLICT DO NOTHING;

-- Insert sample cities for user 2 (María García)
INSERT INTO public.cities (user_id, name, country, latitude, longitude, rating, visit_date, comment)
VALUES 
  (
    '90140f28-583c-4f6e-b437-d0b48bfa0a32',
    'Barcelona',
    'España',
    41.3850639,
    2.1734035,
    5,
    '2023-05-01',
    'Mi ciudad favorita. La Sagrada Familia es una obra maestra de Gaudí.'
  ),
  (
    '90140f28-583c-4f6e-b437-d0b48bfa0a32',
    'Amsterdam',
    'Países Bajos',
    52.3675734,
    4.9041389,
    5,
    '2023-08-18',
    'Los canales y la arquitectura son hermosos. Perfecto para andar en bicicleta.'
  ),
  (
    '90140f28-583c-4f6e-b437-d0b48bfa0a32',
    'Praga',
    'República Checa',
    50.0755381,
    14.4378005,
    4,
    '2023-10-25',
    'Una ciudad de cuento de hadas. El castillo y el puente de Carlos son impresionantes.'
  ),
  (
    '90140f28-583c-4f6e-b437-d0b48bfa0a32',
    'Santorini',
    'Grecia',
    36.3931562,
    25.4615092,
    5,
    '2024-06-20',
    'Las puestas de sol más hermosas del mundo. Un paraíso en la tierra.'
  ),
  (
    '90140f28-583c-4f6e-b437-d0b48bfa0a32',
    'Lisboa',
    'Portugal',
    38.7222524,
    -9.1393366,
    4,
    '2024-08-15',
    'Ciudad con mucho carácter. Los pasteles de nata son deliciosos.'
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED FOR: realtime-for-the-cities-table migration (city_images)
-- ============================================
-- Insert sample city images for user 1's cities
-- Note: These are placeholder URLs. Replace with actual image URLs from your storage bucket
INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT 
  c.id,
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
  c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' 
  AND c.name = 'París'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT 
  c.id,
  'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800',
  c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' 
  AND c.name = 'Roma'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT 
  c.id,
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
  c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' 
  AND c.name = 'Tokio'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Insert sample city images for user 2's cities
INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT 
  c.id,
  'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800',
  c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' 
  AND c.name = 'Barcelona'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT 
  c.id,
  'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800',
  c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' 
  AND c.name = 'Amsterdam'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT 
  c.id,
  'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800',
  c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' 
  AND c.name = 'Santorini'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Add multiple images for some cities to demonstrate the relationship
INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT 
  c.id,
  'https://images.unsplash.com/photo-1502602898737-459b34a21c44?w=800',
  c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' 
  AND c.name = 'París'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT 
  c.id,
  'https://images.unsplash.com/photo-1555993530-0e0b7c0e8b0a?w=800',
  c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' 
  AND c.name = 'Barcelona'
LIMIT 1
ON CONFLICT DO NOTHING;

