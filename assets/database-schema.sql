-- ============================================
-- SUPABASE DATABASE SCHEMA
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste and Run

-- ============================================
-- 1. USERS PROFILES TABLE
-- ============================================
-- This extends the built-in auth.users table with additional user information
-- Supabase Auth automatically creates auth.users, we just add our custom fields

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
-- This trigger automatically creates a profile entry when a new user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 3. COURSES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  badge TEXT,
  price DECIMAL(10,2),
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read courses
CREATE POLICY "Anyone can view courses"
  ON public.courses
  FOR SELECT
  USING (true);

-- Only authenticated users can insert/update courses (for admin)
CREATE POLICY "Authenticated users can manage courses"
  ON public.courses
  FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- 6. INSERT SAMPLE COURSES
-- ============================================

INSERT INTO public.courses (title, description, duration, badge, price, link) VALUES
('Website Development', 'Learn HTML, CSS, JavaScript, responsive design, backend basics, and deployment. Build real-world projects and become job-ready.', '⏱ 6 Months Program', 'Most Sold', 999, 'web-development.html'),
('Digital Marketing', 'Master SEO, Meta Ads, Google Ads, content marketing, analytics, and client acquisition strategies.', '⏱ 3 Months Program', 'Trending', 999, 'digital-marketing.html'),
('AI UGC Ads Creation', 'Create powerful AI-generated ad creatives and viral short-form marketing content for brands.', '⏱ 3 Months Program', 'High Demand', 999, 'ai-ugc-ads.html'),
('Shopify Dropshipping', 'Build and scale a profitable Shopify store with product research, branding, ads strategy, and automation tools.', '⏱ 3 Months Program', 'Bestseller', 999, 'shopify-dropshipping.html'),
('AI Automation & Chatbots', 'Learn AI workflow automation, chatbot building, CRM integrations, and business automation systems.', '⏱ 3 Months Program', 'Future Skill', 999, 'ai-automation-chatbots.html'),
('YouTube Automation', 'Start and scale automated YouTube channels using AI scripting, editing, monetization & outsourcing systems.', '⏱ 3 Months Program', 'Passive Income', 999, 'youtube-automation.html'),
('Graphic Designing', 'Master Photoshop, Illustrator, branding design, social media creatives, and freelance client systems.', '⏱ 3 Months Program', 'Creative', 999, 'graphic-designing.html')
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. VERIFY SETUP
-- ============================================
-- Run this to check if everything was created successfully

SELECT 
  'profiles table' as item, 
  EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') as created
UNION ALL
SELECT 
  'courses table', 
  EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'courses') as created
UNION ALL
SELECT 
  'enrollments table', 
  EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'enrollments') as created
UNION ALL
SELECT 
  'handle_new_user function', 
  EXISTS (SELECT FROM pg_proc WHERE proname = 'handle_new_user') as created
UNION ALL
SELECT 
  'on_auth_user_created trigger', 
  EXISTS (SELECT FROM pg_trigger WHERE tgname = 'on_auth_user_created') as created;
