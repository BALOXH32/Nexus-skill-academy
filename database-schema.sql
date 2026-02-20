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
-- 3. OPTIONAL: COURSES TABLE (for future use)
-- ============================================
-- Uncomment if you want to store course enrollment data

-- CREATE TABLE IF NOT EXISTS public.courses (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   title TEXT NOT NULL,
--   description TEXT,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- CREATE TABLE IF NOT EXISTS public.enrollments (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
--   course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
--   enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   UNIQUE(user_id, course_id)
-- );

-- ============================================
-- 4. VERIFY SETUP
-- ============================================
-- Run this to check if everything was created successfully

SELECT 
  'profiles table' as item, 
  EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') as created
UNION ALL
SELECT 
  'handle_new_user function', 
  EXISTS (SELECT FROM pg_proc WHERE proname = 'handle_new_user') as created
UNION ALL
SELECT 
  'on_auth_user_created trigger', 
  EXISTS (SELECT FROM pg_trigger WHERE tgname = 'on_auth_user_created') as created;
