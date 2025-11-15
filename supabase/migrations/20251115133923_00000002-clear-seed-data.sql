-- Migration to clear seed data
-- This migration removes all seed data inserted by the seed.sql file

-- ============================================
-- Clear city_images for seed users
-- ============================================
DELETE FROM public.city_images
WHERE user_id IN (
  '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
  '90140f28-583c-4f6e-b437-d0b48bfa0a32'
);

-- ============================================
-- Clear cities for seed users
-- ============================================
DELETE FROM public.cities
WHERE user_id IN (
  '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
  '90140f28-583c-4f6e-b437-d0b48bfa0a32'
);

-- ============================================
-- Clear profiles for seed users (optional)
-- Note: This will also delete the profiles if they exist
-- ============================================
DELETE FROM public.profiles
WHERE id IN (
  '4ad9621c-4d3d-4b71-a6cc-34d6e8deaa12',
  '90140f28-583c-4f6e-b437-d0b48bfa0a32'
);

