-- Add new columns to plants table for comprehensive encyclopedia
ALTER TABLE public.plants 
ADD COLUMN IF NOT EXISTS subspecies text DEFAULT 'Not identified',
ADD COLUMN IF NOT EXISTS total_species_in_genus integer,
ADD COLUMN IF NOT EXISTS primary_growing_region text,
ADD COLUMN IF NOT EXISTS best_growing_season text,
ADD COLUMN IF NOT EXISTS weather_climate_requirements text,
ADD COLUMN IF NOT EXISTS care_maintenance_guidelines text,
ADD COLUMN IF NOT EXISTS long_description text,
-- Taxonomy columns
ADD COLUMN IF NOT EXISTS kingdom text DEFAULT 'Plantae',
ADD COLUMN IF NOT EXISTS phylum text,
ADD COLUMN IF NOT EXISTS class text,
ADD COLUMN IF NOT EXISTS plant_order text,
ADD COLUMN IF NOT EXISTS genus text;