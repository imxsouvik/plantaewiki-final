-- Plants encyclopedia table
CREATE TABLE public.plants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  common_name TEXT NOT NULL,
  scientific_name TEXT NOT NULL,
  species TEXT,
  family TEXT,
  origin TEXT,
  description TEXT,
  care_level TEXT DEFAULT 'Medium',
  water_needs TEXT DEFAULT 'Moderate',
  light_needs TEXT DEFAULT 'Partial Sun',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contact submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public access for this public site
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public read access for plants
CREATE POLICY "Anyone can view plants" ON public.plants FOR SELECT USING (true);

-- Public insert for contact form
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- Seed initial plants data
INSERT INTO public.plants (common_name, scientific_name, species, family, origin, description, care_level, water_needs, light_needs) VALUES
('Rose', 'Rosa gallica', 'R. gallica', 'Rosaceae', 'Europe, Asia', 'Classic flowering plant known for fragrant blooms and thorny stems.', 'Medium', 'Moderate', 'Full Sun'),
('Sunflower', 'Helianthus annuus', 'H. annuus', 'Asteraceae', 'North America', 'Tall annual plant with large yellow flower heads that track the sun.', 'Easy', 'Moderate', 'Full Sun'),
('Lavender', 'Lavandula angustifolia', 'L. angustifolia', 'Lamiaceae', 'Mediterranean', 'Aromatic herb with purple flowers, known for calming properties.', 'Easy', 'Low', 'Full Sun'),
('Monstera', 'Monstera deliciosa', 'M. deliciosa', 'Araceae', 'Central America', 'Popular houseplant with distinctive split leaves.', 'Easy', 'Moderate', 'Indirect Light'),
('Snake Plant', 'Dracaena trifasciata', 'D. trifasciata', 'Asparagaceae', 'West Africa', 'Hardy succulent with upright, sword-shaped leaves.', 'Easy', 'Low', 'Low Light'),
('Orchid', 'Phalaenopsis amabilis', 'P. amabilis', 'Orchidaceae', 'Southeast Asia', 'Elegant flowering plant with long-lasting blooms.', 'Medium', 'Low', 'Indirect Light'),
('Basil', 'Ocimum basilicum', 'O. basilicum', 'Lamiaceae', 'Asia, Africa', 'Culinary herb with aromatic leaves used in cooking.', 'Easy', 'Moderate', 'Full Sun'),
('Aloe Vera', 'Aloe vera', 'A. vera', 'Asphodelaceae', 'Arabian Peninsula', 'Succulent with medicinal gel inside thick leaves.', 'Easy', 'Low', 'Bright Light'),
('Tomato', 'Solanum lycopersicum', 'S. lycopersicum', 'Solanaceae', 'South America', 'Popular vegetable plant producing red edible fruits.', 'Medium', 'High', 'Full Sun'),
('Fern', 'Nephrolepis exaltata', 'N. exaltata', 'Nephrolepidaceae', 'Tropical regions', 'Lush green plant with feathery fronds.', 'Medium', 'High', 'Indirect Light'),
('Cactus', 'Opuntia ficus-indica', 'O. ficus-indica', 'Cactaceae', 'Mexico', 'Desert plant with flat paddle-shaped stems.', 'Easy', 'Low', 'Full Sun'),
('Mint', 'Mentha spicata', 'M. spicata', 'Lamiaceae', 'Europe, Asia', 'Fast-growing herb with refreshing scent and flavor.', 'Easy', 'Moderate', 'Partial Sun'),
('Peace Lily', 'Spathiphyllum wallisii', 'S. wallisii', 'Araceae', 'Colombia', 'Elegant houseplant with white spathe flowers.', 'Easy', 'Moderate', 'Low Light'),
('Bamboo', 'Bambusa vulgaris', 'B. vulgaris', 'Poaceae', 'Asia', 'Fast-growing grass with woody hollow stems.', 'Easy', 'High', 'Full Sun'),
('Jasmine', 'Jasminum officinale', 'J. officinale', 'Oleaceae', 'Himalayas', 'Fragrant climbing vine with white star-shaped flowers.', 'Medium', 'Moderate', 'Full Sun'),
('Tulip', 'Tulipa gesneriana', 'T. gesneriana', 'Liliaceae', 'Central Asia', 'Spring bulb flower in many colors.', 'Medium', 'Moderate', 'Full Sun'),
('Rosemary', 'Salvia rosmarinus', 'S. rosmarinus', 'Lamiaceae', 'Mediterranean', 'Woody herb with needle-like aromatic leaves.', 'Easy', 'Low', 'Full Sun'),
('Fiddle Leaf Fig', 'Ficus lyrata', 'F. lyrata', 'Moraceae', 'West Africa', 'Trendy houseplant with large violin-shaped leaves.', 'Medium', 'Moderate', 'Bright Light'),
('Pothos', 'Epipremnum aureum', 'E. aureum', 'Araceae', 'Southeast Asia', 'Trailing vine perfect for beginners.', 'Easy', 'Low', 'Low Light'),
('Hibiscus', 'Hibiscus rosa-sinensis', 'H. rosa-sinensis', 'Malvaceae', 'Asia', 'Tropical shrub with large colorful flowers.', 'Medium', 'Moderate', 'Full Sun');