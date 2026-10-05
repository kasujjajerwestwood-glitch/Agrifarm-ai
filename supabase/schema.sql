-- ====================================================================
-- AGRIFARM AI ASSISTANT MANAGER - SUPABASE POSTGRESQL SCHEMA
-- Complete database definitions, Row Level Security (RLS) policies,
-- storage buckets, user auto-provisioning triggers, and indexes.
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USER PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  country TEXT DEFAULT 'Uganda',
  district TEXT DEFAULT 'Wakiso',
  town_village TEXT,
  farmer_type TEXT DEFAULT 'Smallholder Farmer',
  preferred_language TEXT DEFAULT 'en',
  farm_experience TEXT DEFAULT '3-5 years',
  avatar_url TEXT,
  role TEXT DEFAULT 'farmer' CHECK (role IN ('farmer', 'agronomist', 'officer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FARMS TABLE
CREATE TABLE IF NOT EXISTS public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  district TEXT NOT NULL,
  size_hectares NUMERIC DEFAULT 2.0,
  size_unit TEXT DEFAULT 'hectares',
  main_crops TEXT,
  soil_type TEXT DEFAULT 'Loam',
  irrigation_method TEXT DEFAULT 'Rainfed',
  description TEXT,
  latitude NUMERIC DEFAULT 0.4124,
  longitude NUMERIC DEFAULT 32.5186,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FIELDS / PLOTS TABLE
CREATE TABLE IF NOT EXISTS public.fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  area_acres NUMERIC DEFAULT 1.0,
  soil_type TEXT DEFAULT 'Sandy Loam',
  irrigation TEXT DEFAULT 'Drip',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CROPS TABLE
CREATE TABLE IF NOT EXISTS public.crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
  field_name TEXT DEFAULT 'Main Plot',
  name TEXT NOT NULL,
  variety TEXT,
  planting_date DATE DEFAULT CURRENT_DATE,
  expected_harvest_date DATE,
  growth_stage TEXT DEFAULT 'Vegetative Growth',
  current_health TEXT DEFAULT 'Healthy' CHECK (current_health IN ('Healthy', 'Attention Needed', 'Disease Detected', 'Pest Infestation', 'Nutrient Deficiency', 'Environmental Stress')),
  notes TEXT,
  photo_url TEXT,
  scans_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PLANT SCANS & DIAGNOSES TABLE
CREATE TABLE IF NOT EXISTS public.plant_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
  crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
  crop_name TEXT NOT NULL,
  growth_stage TEXT,
  symptoms_observed TEXT,
  image_url TEXT NOT NULL,
  analysis JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PESTS DATABASE TABLE (Agronomic Knowledge)
CREATE TABLE IF NOT EXISTS public.pests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  scientific_name TEXT,
  local_names JSONB DEFAULT '{}'::jsonb,
  category TEXT DEFAULT 'Insect Pest',
  target_crops TEXT[] DEFAULT '{}',
  identification_marks TEXT,
  symptoms_damage TEXT[] DEFAULT '{}',
  life_cycle_summary TEXT,
  economic_threshold TEXT,
  cultural_controls TEXT[] DEFAULT '{}',
  biological_controls TEXT[] DEFAULT '{}',
  chemical_controls TEXT[] DEFAULT '{}',
  monitoring_guidance TEXT,
  image_url TEXT,
  source_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. DISEASES DATABASE TABLE (Agronomic Knowledge)
CREATE TABLE IF NOT EXISTS public.diseases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  scientific_name TEXT,
  pathogen_type TEXT DEFAULT 'Fungus',
  local_names JSONB DEFAULT '{}'::jsonb,
  target_crops TEXT[] DEFAULT '{}',
  symptoms TEXT[] DEFAULT '{}',
  transmission_vectors TEXT,
  trigger_conditions TEXT,
  cultural_management TEXT[] DEFAULT '{}',
  organic_treatment TEXT[] DEFAULT '{}',
  chemical_treatment TEXT[] DEFAULT '{}',
  resistant_varieties TEXT[] DEFAULT '{}',
  image_url TEXT,
  source_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CROP KNOWLEDGE & COMPENDIUM TABLE
CREATE TABLE IF NOT EXISTS public.crop_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  scientific_name TEXT,
  local_names JSONB DEFAULT '{}'::jsonb,
  category TEXT NOT NULL,
  description JSONB DEFAULT '{}'::jsonb,
  soil_ph TEXT,
  soil_type TEXT,
  temperature_range TEXT,
  rainfall TEXT,
  spacing TEXT,
  seed_rate TEXT,
  maturity_days TEXT,
  expected_yield TEXT,
  fertilizer_plan JSONB DEFAULT '{}'::jsonb,
  harvesting_guidelines TEXT,
  common_pests TEXT[] DEFAULT '{}',
  common_diseases TEXT[] DEFAULT '{}',
  research_citations TEXT[] DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. FARM ACTIVITIES / RECORD KEEPING TABLE
CREATE TABLE IF NOT EXISTS public.farm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('Planting', 'Fertilization', 'Spraying', 'Irrigation', 'Weeding', 'Harvesting', 'Pruning', 'Scouting', 'Soil Test')),
  date DATE DEFAULT CURRENT_DATE,
  cost NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AI CONVERSATIONS & CHAT HISTORY
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Agricultural Consultation',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SMART NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'Information' CHECK (type IN ('Information', 'Attention', 'Warning')),
  category TEXT DEFAULT 'general',
  is_read BOOLEAN DEFAULT false,
  related_crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SENSORS & TELEMETRY TABLE
CREATE TABLE IF NOT EXISTS public.sensors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
  sensor_name TEXT NOT NULL,
  sensor_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  status TEXT DEFAULT 'Normal',
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Clean idempotent setup: Drop previous policies if they already exist
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_knowledge ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Farms policies
DROP POLICY IF EXISTS "Users can manage their own farms" ON public.farms;
CREATE POLICY "Users can manage their own farms" ON public.farms
  FOR ALL USING (auth.uid() = user_id);

-- Fields policies
DROP POLICY IF EXISTS "Users can manage their own fields" ON public.fields;
CREATE POLICY "Users can manage their own fields" ON public.fields
  FOR ALL USING (auth.uid() = user_id);

-- Crops policies
DROP POLICY IF EXISTS "Users can manage their own crops" ON public.crops;
CREATE POLICY "Users can manage their own crops" ON public.crops
  FOR ALL USING (auth.uid() = user_id);

-- Plant scans policies
DROP POLICY IF EXISTS "Users can manage their own plant scans" ON public.plant_scans;
CREATE POLICY "Users can manage their own plant scans" ON public.plant_scans
  FOR ALL USING (auth.uid() = user_id);

-- Farm activities policies
DROP POLICY IF EXISTS "Users can manage their own farm activities" ON public.farm_activities;
CREATE POLICY "Users can manage their own farm activities" ON public.farm_activities
  FOR ALL USING (auth.uid() = user_id);

-- AI Conversations policies
DROP POLICY IF EXISTS "Users can manage their own AI conversations" ON public.ai_conversations;
CREATE POLICY "Users can manage their own AI conversations" ON public.ai_conversations
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own AI messages" ON public.ai_messages;
CREATE POLICY "Users can manage their own AI messages" ON public.ai_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.ai_conversations
      WHERE id = ai_messages.conversation_id AND user_id = auth.uid()
    )
  );

-- Notifications policies
DROP POLICY IF EXISTS "Users can manage their own notifications" ON public.notifications;
CREATE POLICY "Users can manage their own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- Sensors policies
DROP POLICY IF EXISTS "Users can manage their own sensors" ON public.sensors;
CREATE POLICY "Users can manage their own sensors" ON public.sensors
  FOR ALL USING (auth.uid() = user_id);

-- Knowledge base (Pests, Diseases, Crop Knowledge) are readable by all users
DROP POLICY IF EXISTS "Public read access for pests knowledge" ON public.pests;
CREATE POLICY "Public read access for pests knowledge" ON public.pests
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for diseases knowledge" ON public.diseases;
CREATE POLICY "Public read access for diseases knowledge" ON public.diseases
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for crop knowledge" ON public.crop_knowledge;
CREATE POLICY "Public read access for crop knowledge" ON public.crop_knowledge
  FOR SELECT USING (true);

-- Admin write policies for knowledge tables
DROP POLICY IF EXISTS "Admins can manage pests knowledge" ON public.pests;
CREATE POLICY "Admins can manage pests knowledge" ON public.pests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage diseases knowledge" ON public.diseases;
CREATE POLICY "Admins can manage diseases knowledge" ON public.diseases
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage crop knowledge" ON public.crop_knowledge;
CREATE POLICY "Admins can manage crop knowledge" ON public.crop_knowledge
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ====================================================================
-- AUTOMATIC USER PROFILE TRIGGER
-- Auto creates a profile and default farm when a farmer signs up
-- ====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    'farmer'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.farms (user_id, name, location, district, size_hectares, main_crops, soil_type, irrigation_method)
  VALUES (
    new.id,
    'My Primary Farm',
    'Plot 14 - Agri Sector',
    'Wakiso',
    2.5,
    'Maize, Beans, Tomatoes',
    'Loam',
    'Rainfed'
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ====================================================================
-- STORAGE BUCKETS
-- Public read, authenticated write for crop diagnostic scans & profile
-- ====================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('plant-images', 'plant-images', true),
  ('profile-images', 'profile-images', true),
  ('farm-images', 'farm-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow authenticated users to upload plant images" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload plant images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'plant-images');

DROP POLICY IF EXISTS "Allow public view of plant images" ON storage.objects;
CREATE POLICY "Allow public view of plant images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'plant-images');

DROP POLICY IF EXISTS "Allow authenticated users to upload profile images" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload profile images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-images');

DROP POLICY IF EXISTS "Allow public view of profile images" ON storage.objects;
CREATE POLICY "Allow public view of profile images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-images');

DROP POLICY IF EXISTS "Allow authenticated users to upload farm images" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload farm images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'farm-images');

DROP POLICY IF EXISTS "Allow public view of farm images" ON storage.objects;
CREATE POLICY "Allow public view of farm images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'farm-images');
