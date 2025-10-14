-- Create comprehensive Supabase schema with RLS policies
-- This script creates all tables and sets up Row Level Security

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schema migrations table first
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    description TEXT,
    executed_at TIMESTAMP DEFAULT NOW()
);

-- School Years table
CREATE TABLE IF NOT EXISTS school_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year_label VARCHAR(50) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on school_years
ALTER TABLE school_years ENABLE ROW LEVEL SECURITY;

-- RLS policies for school_years (public read, admin write)
CREATE POLICY "Allow public read access to school_years" ON school_years FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert school_years" ON school_years FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to update school_years" ON school_years FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Student Profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    school_year_id UUID REFERENCES school_years(id) ON DELETE CASCADE,
    school_id VARCHAR(100) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    preferred_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    photo_url TEXT,
    department VARCHAR(255) NOT NULL,
    year VARCHAR(50) NOT NULL,
    block VARCHAR(50) NOT NULL,
    course_program VARCHAR(255),
    major VARCHAR(100),
    officer_role VARCHAR(100),
    honors TEXT,
    quote TEXT,
    ambition TEXT,
    hobbies JSONB DEFAULT '[]',
    achievements JSONB DEFAULT '[]',
    activities JSONB DEFAULT '[]',
    favorite_memory TEXT,
    message_to_classmates TEXT,
    gallery_images JSONB DEFAULT '[]',
    -- Additional comprehensive fields
    age INTEGER,
    nickname VARCHAR(100),
    gender VARCHAR(50),
    birthday DATE,
    address TEXT,
    saying_motto TEXT,
    dream_job VARCHAR(200),
    father_guardian_name VARCHAR(200),
    mother_guardian_name VARCHAR(200),
    social_media_facebook VARCHAR(200),
    social_media_instagram VARCHAR(200),
    social_media_twitter VARCHAR(200),
    profile_picture_url TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'archived')),
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on student_profiles
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for student_profiles
CREATE POLICY "Allow users to view their own student profile" ON student_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own student profile" ON student_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own student profile" ON student_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow public read access to approved student profiles" ON student_profiles FOR SELECT USING (status = 'approved');

-- Faculty Profiles table
CREATE TABLE IF NOT EXISTS faculty_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    school_year_id UUID REFERENCES school_years(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    preferred_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    photo_url TEXT,
    position VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    office VARCHAR(255),
    years_of_service INTEGER,
    bio TEXT NOT NULL,
    achievements JSONB DEFAULT '[]',
    courses JSONB DEFAULT '[]',
    additional_roles JSONB DEFAULT '[]',
    social_links JSONB,
    -- Additional comprehensive fields
    age INTEGER,
    nickname VARCHAR(100),
    gender VARCHAR(50),
    birthday DATE,
    address TEXT,
    saying_motto TEXT,
    social_media_facebook VARCHAR(200),
    social_media_instagram VARCHAR(200),
    social_media_twitter VARCHAR(200),
    profile_picture_url TEXT,
    message_to_students TEXT,
    teaching_philosophy TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'archived')),
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on faculty_profiles
ALTER TABLE faculty_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for faculty_profiles
CREATE POLICY "Allow users to view their own faculty profile" ON faculty_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own faculty profile" ON faculty_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own faculty profile" ON faculty_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow public read access to approved faculty profiles" ON faculty_profiles FOR SELECT USING (status = 'approved');

-- Alumni Profiles table
CREATE TABLE IF NOT EXISTS alumni_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    school_year_id UUID REFERENCES school_years(id) ON DELETE CASCADE,
    school_id VARCHAR(100) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    preferred_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    photo_url TEXT,
    department VARCHAR(255) NOT NULL,
    graduation_year VARCHAR(10) NOT NULL,
    current_job_title VARCHAR(255),
    current_employer VARCHAR(255),
    location VARCHAR(255),
    linkedin_url TEXT,
    personal_website TEXT,
    family TEXT,
    message_to_students TEXT,
    achievements JSONB DEFAULT '[]',
    gallery_images JSONB DEFAULT '[]',
    -- Additional comprehensive fields
    age INTEGER,
    nickname VARCHAR(100),
    gender VARCHAR(50),
    birthday DATE,
    address TEXT,
    saying_motto TEXT,
    current_profession VARCHAR(200),
    current_company VARCHAR(200),
    current_location VARCHAR(200),
    social_media_facebook VARCHAR(200),
    social_media_instagram VARCHAR(200),
    social_media_twitter VARCHAR(200),
    profile_picture_url TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'archived')),
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on alumni_profiles
ALTER TABLE alumni_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for alumni_profiles
CREATE POLICY "Allow users to view their own alumni profile" ON alumni_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own alumni profile" ON alumni_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own alumni profile" ON alumni_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow public read access to approved alumni profiles" ON alumni_profiles FOR SELECT USING (status = 'approved');

-- Staff Profiles table
CREATE TABLE IF NOT EXISTS staff_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    school_year_id UUID REFERENCES school_years(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    preferred_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    photo_url TEXT,
    role VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    years_of_service INTEGER,
    achievements JSONB DEFAULT '[]',
    -- Additional comprehensive fields
    age INTEGER,
    nickname VARCHAR(100),
    gender VARCHAR(50),
    birthday DATE,
    address TEXT,
    saying_motto TEXT,
    office_assigned VARCHAR(200),
    social_media_facebook VARCHAR(200),
    social_media_instagram VARCHAR(200),
    social_media_twitter VARCHAR(200),
    profile_picture_url TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'archived')),
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on staff_profiles
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for staff_profiles
CREATE POLICY "Allow users to view their own staff profile" ON staff_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own staff profile" ON staff_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own staff profile" ON staff_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow public read access to approved staff profiles" ON staff_profiles FOR SELECT USING (status = 'approved');

-- Utility Profiles table
CREATE TABLE IF NOT EXISTS utility_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    school_year_id UUID REFERENCES school_years(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    preferred_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    photo_url TEXT,
    role VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    years_of_service INTEGER,
    achievements JSONB DEFAULT '[]',
    -- Additional comprehensive fields
    age INTEGER,
    nickname VARCHAR(100),
    gender VARCHAR(50),
    birthday DATE,
    address TEXT,
    saying_motto TEXT,
    office_assigned VARCHAR(200),
    social_media_facebook VARCHAR(200),
    social_media_instagram VARCHAR(200),
    social_media_twitter VARCHAR(200),
    profile_picture_url TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'archived')),
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on utility_profiles
ALTER TABLE utility_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for utility_profiles
CREATE POLICY "Allow users to view their own utility profile" ON utility_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own utility profile" ON utility_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own utility profile" ON utility_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow public read access to approved utility profiles" ON utility_profiles FOR SELECT USING (status = 'approved');

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL, -- 'elementary', 'junior_high', 'senior_high', 'college', 'graduate'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on departments
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to departments" ON departments FOR SELECT USING (true);

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(20),
    year_levels TEXT[], -- Array of available year levels
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on programs
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to programs" ON programs FOR SELECT USING (true);

-- Sections table
CREATE TABLE IF NOT EXISTS sections (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    year_level VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on sections
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to sections" ON sections FOR SELECT USING (true);

-- Insert default school years
INSERT INTO school_years (year_label, start_date, end_date, is_active) VALUES
('2024-2025', '2024-08-01', '2025-07-31', true),
('2023-2024', '2023-08-01', '2024-07-31', false)
ON CONFLICT (year_label) DO NOTHING;

-- Insert default department data
INSERT INTO departments (name, type) VALUES
('Elementary', 'elementary'),
('Junior High', 'junior_high'),
('Senior High', 'senior_high'),
('College', 'college'),
('Graduate School', 'graduate')
ON CONFLICT (name) DO NOTHING;

-- Insert default programs for Senior High
INSERT INTO programs (department_id, name, code, year_levels) 
SELECT d.id, 'STEM', 'STEM', ARRAY['Grade 11', 'Grade 12']
FROM departments d WHERE d.name = 'Senior High'
ON CONFLICT DO NOTHING;

INSERT INTO programs (department_id, name, code, year_levels) 
SELECT d.id, 'HUMSS', 'HUMSS', ARRAY['Grade 11', 'Grade 12']
FROM departments d WHERE d.name = 'Senior High'
ON CONFLICT DO NOTHING;

INSERT INTO programs (department_id, name, code, year_levels) 
SELECT d.id, 'ABM', 'ABM', ARRAY['Grade 11', 'Grade 12']
FROM departments d WHERE d.name = 'Senior High'
ON CONFLICT DO NOTHING;

-- Insert default programs for College
INSERT INTO programs (department_id, name, code, year_levels) 
SELECT d.id, 'BS Computer Science', 'BSCS', ARRAY['1st Year', '2nd Year', '3rd Year', '4th Year']
FROM departments d WHERE d.name = 'College'
ON CONFLICT DO NOTHING;

INSERT INTO programs (department_id, name, code, year_levels) 
SELECT d.id, 'BS Information Technology', 'BSIT', ARRAY['1st Year', '2nd Year', '3rd Year', '4th Year']
FROM departments d WHERE d.name = 'College'
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_school_year ON student_profiles(school_year_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_status ON student_profiles(status);
CREATE INDEX IF NOT EXISTS idx_faculty_profiles_user_id ON faculty_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_faculty_profiles_school_year ON faculty_profiles(school_year_id);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_user_id ON alumni_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_school_year ON alumni_profiles(school_year_id);
CREATE INDEX IF NOT EXISTS idx_staff_profiles_user_id ON staff_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_profiles_school_year ON staff_profiles(school_year_id);
CREATE INDEX IF NOT EXISTS idx_utility_profiles_user_id ON utility_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_utility_profiles_school_year ON utility_profiles(school_year_id);

-- Log the migration
INSERT INTO schema_migrations (version, description, executed_at) 
VALUES ('v5_supabase_schema_with_rls', 'Created comprehensive Supabase schema with RLS policies', NOW())
ON CONFLICT (version) DO NOTHING;
