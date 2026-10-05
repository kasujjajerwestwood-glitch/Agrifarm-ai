# Complete Supabase Integration Guide for Agrifarm AI

This guide provides the exact steps, SQL table definitions, and Row Level Security (RLS) policies needed to connect your Supabase project to the **Agrifarm AI Assistant Manager**.

---

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and log in (or create a free account).
2. Click **New Project**.
3. Fill in:
   - **Name**: `Agrifarm-AI` (or your preferred name)
   - **Database Password**: Choose a strong password and save it in a safe place.
   - **Region**: Choose a region close to your primary users (e.g., *Central EU (Frankfurt)*, *East US*, or *South Africa (Johannesburg)*).
4. Click **Create new project** and wait 1–2 minutes for the database to provision.

---

## 2. Obtain Your API Keys

1. In your Supabase project dashboard, navigate to **Project Settings** (gear icon at the bottom of the left sidebar).
2. Select **API** under Configuration.
3. Locate:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **Project API Keys** -> `anon` / `public` key (long string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6...`)
4. Copy these two values.

---

## 3. Run the Database Migration SQL in SQL Editor

1. In the Supabase left navigation bar, click the **SQL Editor** (icon with `>_` terminal).
2. Click **New query** (or the green `+` button).
3. Paste the entire SQL script below and click **Run** (or press `Ctrl + Enter` / `Cmd + Enter`).

```sql
-- ====================================================================
-- AGRIFARM UGANDA - COMPLETE DATABASE DEFINITION & RLS
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. USER PROFILES TABLE (Linked with Supabase auth.users)
-- ====================================================================
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

-- ====================================================================
-- 3. FARMS TABLE
-- ====================================================================
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

-- ====================================================================
-- 4. CROPS TABLE
-- ====================================================================
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
  current_health TEXT DEFAULT 'Healthy' CHECK (current_health IN (
    'Healthy', 'Attention Needed', 'Disease Detected', 'Pest Infestation', 'Nutrient Deficiency', 'Environmental Stress'
  )),
  notes TEXT,
  photo_url TEXT,
  scans_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 5. PLANT SCANS & DIAGNOSES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.plant_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
  crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
  crop_name TEXT NOT NULL,
  growth_stage TEXT DEFAULT 'Vegetative Growth',
  symptoms_observed TEXT,
  image_url TEXT NOT NULL,
  analysis JSONB NOT NULL,
  location TEXT,
  farmer_notes TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 6. FARM ACTIVITIES (TASKS & RECORD KEEPING) TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.farm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
  field_name TEXT DEFAULT 'Field Plot',
  title TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  cost NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 7. NOTIFICATIONS & ALERTS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'Information' CHECK (type IN ('Information', 'Attention', 'Warning')),
  category TEXT DEFAULT 'general',
  is_read BOOLEAN DEFAULT FALSE,
  related_crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES — STRICT FARMER DATA ISOLATION
-- ====================================================================

-- Enable RLS on all user tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 8.1 Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 8.2 Farms policies
CREATE POLICY "Users can select their own farms" ON public.farms
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own farms" ON public.farms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farms" ON public.farms
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own farms" ON public.farms
  FOR DELETE USING (auth.uid() = user_id);

-- 8.3 Crops policies
CREATE POLICY "Users can select their own crops" ON public.crops
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own crops" ON public.crops
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crops" ON public.crops
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crops" ON public.crops
  FOR DELETE USING (auth.uid() = user_id);

-- 8.4 Plant scans policies
CREATE POLICY "Users can select their own plant scans" ON public.plant_scans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plant scans" ON public.plant_scans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plant scans" ON public.plant_scans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plant scans" ON public.plant_scans
  FOR DELETE USING (auth.uid() = user_id);

-- 8.5 Farm activities policies
CREATE POLICY "Users can select their own farm activities" ON public.farm_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own farm activities" ON public.farm_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farm activities" ON public.farm_activities
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own farm activities" ON public.farm_activities
  FOR DELETE USING (auth.uid() = user_id);

-- 8.6 Notifications policies
CREATE POLICY "Users can select their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- ====================================================================
-- 9. USER PROVISIONING TRIGGER (AUTOMATIC PROFILE CREATION ON SIGNUP)
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

  -- Create initial primary farm for the new farmer
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
-- 10. STORAGE BUCKETS (FOR CROP, SCAN & PROFILE IMAGES)
-- ====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('plant-images', 'plant-images', true),
  ('profile-images', 'profile-images', true),
  ('farm-images', 'farm-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for authenticated users
CREATE POLICY "Allow authenticated users to upload plant images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'plant-images');

CREATE POLICY "Allow public view of plant images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'plant-images');

CREATE POLICY "Allow authenticated users to upload profile images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Allow public view of profile images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-images');
```

---

## 4. Connect the Credentials to Agrifarm AI

You can connect your Supabase credentials through either of two ways:

### Option A: In-App Assistant (Instant Setup)
1. Open the **Agrifarm AI** web application.
2. In the left desktop sidebar (or in the mobile **More** drawer), click **Supabase Setup Pending** (or go to **Settings &rarr; Supabase Cloud & PostgreSQL Database Bridge**).
3. The **Supabase Backend Assistant** modal will open.
4. Enter:
   - **Supabase Project URL**: Paste your URL (`https://your-ref.supabase.co`).
   - **Supabase Anon / Public Key**: Paste your `anon` key.
5. Click **Test Connection**. A green checkmark will confirm that your Supabase project is active and responding.
6. Click **Save Credentials & Reload**.

### Option B: Environment Variables (Production & CI/CD)
Add your credentials to your `.env` file:
```env
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```

---

## 5. Verifying Your Setup

1. **Authentication**:
   - In Agrifarm AI, click **Farmer Profile &rarr; Sign In / Register**.
   - Register a new account with an email and password.
   - Go to your Supabase console &rarr; **Authentication &rarr; Users** to confirm the user appears.
   - Go to **Table Editor &rarr; profiles** to verify that the profile was automatically provisioned with the user's UUID.
2. **Plant Scans**:
   - Perform a plant scan on the **Plant Health Scanner** screen.
   - Check **Table Editor &rarr; plant_scans** to see the diagnostic result stored in JSONB and linked to your farmer ID.
3. **Row Level Security (RLS) Verification**:
   - If you log out and sign in with a different farmer account, you will only see the new farmer's farms, crops, scans, and activities. The previous farmer's records are completely hidden by Postgres at the database engine level.
