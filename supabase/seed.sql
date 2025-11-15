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
  ),
  (
    '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
    'Berlín',
    'Alemania',
    52.5200066,
    13.404954,
    5,
    '2024-05-18',
    'Una ciudad llena de historia y cultura. El Muro de Berlín y los museos son fascinantes.'
  ),
  (
    '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
    'Dubái',
    'Emiratos Árabes Unidos',
    25.2048493,
    55.2707828,
    4,
    '2024-07-22',
    'Lujo y modernidad en el desierto. Los rascacielos y las islas artificiales son impresionantes.'
  ),
  (
    '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
    'Sídney',
    'Australia',
    -33.8688197,
    151.2092955,
    5,
    '2024-09-10',
    'La Ópera de Sídney es icónica. Las playas y el puerto son espectaculares.'
  ),
  (
    '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
    'Seúl',
    'Corea del Sur',
    37.566535,
    126.9779692,
    4,
    '2024-11-05',
    'Tecnología y tradición se mezclan perfectamente. La comida callejera es increíble.'
  ),
  (
    '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
    'Bangkok',
    'Tailandia',
    13.7563309,
    100.5017651,
    5,
    '2024-12-20',
    'Una ciudad vibrante con templos dorados y comida deliciosa. Los mercados flotantes son únicos.'
  ),
  (
    '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
    'Singapur',
    'Singapur',
    1.352083,
    103.819836,
    5,
    '2025-01-10',
    'La ciudad más limpia del mundo. Los jardines en la bahía son impresionantes.'
  ),
  (
    '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
    'Hong Kong',
    'China',
    22.3193039,
    114.1693611,
    4,
    '2025-02-15',
    'Rascacielos impresionantes y una mezcla fascinante de culturas orientales y occidentales.'
  ),
  (
    '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
    'Cairo',
    'Egipto',
    30.0444196,
    31.2357116,
    5,
    '2025-03-22',
    'Las pirámides de Giza son una de las maravillas del mundo. La historia antigua es fascinante.'
  ),
  (
    '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
    'Mumbai',
    'India',
    19.0759837,
    72.8776559,
    4,
    '2025-04-18',
    'Una ciudad de contrastes. La puerta de la India y los sabores locales son inolvidables.'
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
  ),
  (
    '90140f28-583c-4f6e-b437-d0b48bfa0a32',
    'Viena',
    'Austria',
    48.2081743,
    16.3738189,
    5,
    '2024-09-28',
    'La capital de la música clásica. Los palacios y la arquitectura barroca son hermosos.'
  ),
  (
    '90140f28-583c-4f6e-b437-d0b48bfa0a32',
    'Estambul',
    'Turquía',
    41.0082376,
    28.9783589,
    5,
    '2024-10-12',
    'Donde se encuentran Europa y Asia. La Mezquita Azul y el Bósforo son inolvidables.'
  ),
  (
    '90140f28-583c-4f6e-b437-d0b48bfa0a32',
    'Marrakech',
    'Marruecos',
    31.6294723,
    -7.9810845,
    4,
    '2024-11-20',
    'Una explosión de colores y aromas. Los zocos y la plaza Jemaa el-Fnaa son mágicos.'
  ),
  (
    '90140f28-583c-4f6e-b437-d0b48bfa0a32',
    'Reykjavik',
    'Islandia',
    64.146582,
    -21.9426354,
    5,
    '2024-12-15',
    'La capital más al norte del mundo. Las auroras boreales y los géiseres son únicos.'
  ),
  (
    '90140f28-583c-4f6e-b437-d0b48bfa0a32',
    'Copenhague',
    'Dinamarca',
    55.6760968,
    12.5683371,
    5,
    '2025-01-25',
    'La ciudad más feliz del mundo. La Sirenita y los canales son encantadores.'
  ),
  (
    '90140f28-583c-4f6e-b437-d0b48bfa0a32',
    'Edimburgo',
    'Reino Unido',
    55.953252,
    -3.188267,
    5,
    '2025-02-28',
    'Una ciudad medieval con un castillo imponente. El festival de Edimburgo es increíble.'
  ),
  (
    '90140f28-583c-4f6e-b437-d0b48bfa0a32',
    'Dublín',
    'Irlanda',
    53.3498053,
    -6.2603097,
    4,
    '2025-03-15',
    'La capital de Irlanda con pubs tradicionales y música en vivo. El Trinity College es hermoso.'
  ),
  (
    '90140f28-583c-4f6e-b437-d0b48bfa0a32',
    'Brujas',
    'Bélgica',
    51.209348,
    3.2246995,
    5,
    '2025-04-10',
    'Una ciudad de cuento de hadas con canales y arquitectura medieval. El chocolate es delicioso.'
  ),
  (
    '90140f28-583c-4f6e-b437-d0b48bfa0a32',
    'Florencia',
    'Italia',
    43.7695604,
    11.2558136,
    5,
    '2025-05-05',
    'La cuna del Renacimiento. El Duomo y la Galería Uffizi son imprescindibles.'
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED FOR: realtime-for-the-cities-table migration (city_images)
-- ============================================
-- Insert images for user 1's cities (15 cities total)
-- First 5 cities will have 2 images each, remaining 10 will have 1 image each

-- París (2 images)
INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'París'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1502602898737-459b34a21c44?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'París'
ON CONFLICT DO NOTHING;

-- Roma (2 images)
INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'Roma'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'Roma'
ON CONFLICT DO NOTHING;

-- Tokio (2 images)
INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'Tokio'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'Tokio'
ON CONFLICT DO NOTHING;

-- Nueva York (2 images)
INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'Nueva York'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'Nueva York'
ON CONFLICT DO NOTHING;

-- Londres (2 images)
INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'Londres'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'Londres'
ON CONFLICT DO NOTHING;

-- Rest of user 1's cities (1 image each)
INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1587330979470-3595ac045ab0?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'Berlín'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'Dubái'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'Sídney'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'Seúl'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'Bangkok'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'Singapur'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'Hong Kong'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'Cairo'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12' AND c.name = 'Mumbai'
ON CONFLICT DO NOTHING;

-- Insert images for user 2's cities (15 cities total)
-- First 5 cities will have 2 images each, remaining 10 will have 1 image each

-- Barcelona (2 images)
INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Barcelona'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1555993530-0e0b7c0e8b0a?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Barcelona'
ON CONFLICT DO NOTHING;

-- Amsterdam (2 images)
INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Amsterdam'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1533050487297-09b450131914?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Amsterdam'
ON CONFLICT DO NOTHING;

-- Santorini (2 images)
INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Santorini'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Santorini'
ON CONFLICT DO NOTHING;

-- Viena (2 images)
INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Viena'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Viena'
ON CONFLICT DO NOTHING;

-- Estambul (2 images)
INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Estambul'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Estambul'
ON CONFLICT DO NOTHING;

-- Rest of user 2's cities (1 image each)
INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1555993530-0e0b7c0e8b0a?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Praga'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Lisboa'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Marrakech'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Reykjavik'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Copenhague'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Edimburgo'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Dublín'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1555993530-0e0b7c0e8b0a?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Brujas'
ON CONFLICT DO NOTHING;

INSERT INTO public.city_images (city_id, image_url, user_id)
SELECT c.id, 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=800', c.user_id
FROM public.cities c
WHERE c.user_id = '90140f28-583c-4f6e-b437-d0b48bfa0a32' AND c.name = 'Florencia'
ON CONFLICT DO NOTHING;

