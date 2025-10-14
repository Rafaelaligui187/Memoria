-- Add comprehensive fields for role-aware profile setup system
-- This script adds all the new fields required for the unified profile system

-- Add new fields to student_profiles table
ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS nickname VARCHAR(100),
ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS saying_motto TEXT,
ADD COLUMN IF NOT EXISTS dream_job VARCHAR(200),
ADD COLUMN IF NOT EXISTS father_guardian_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS mother_guardian_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS social_media_facebook VARCHAR(200),
ADD COLUMN IF NOT EXISTS social_media_instagram VARCHAR(200),
ADD COLUMN IF NOT EXISTS social_media_twitter VARCHAR(200),
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
ADD COLUMN IF NOT EXISTS achievements TEXT[], -- Array of achievements
ADD COLUMN IF NOT EXISTS activities TEXT[]; -- Array of activities

-- Add new fields to faculty_profiles table
ALTER TABLE faculty_profiles 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS nickname VARCHAR(100),
ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS saying_motto TEXT,
ADD COLUMN IF NOT EXISTS social_media_facebook VARCHAR(200),
ADD COLUMN IF NOT EXISTS social_media_instagram VARCHAR(200),
ADD COLUMN IF NOT EXISTS social_media_twitter VARCHAR(200),
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
ADD COLUMN IF NOT EXISTS achievements TEXT[],
ADD COLUMN IF NOT EXISTS message_to_students TEXT,
ADD COLUMN IF NOT EXISTS teaching_philosophy TEXT;

-- Add new fields to alumni_profiles table
ALTER TABLE alumni_profiles 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS nickname VARCHAR(100),
ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS saying_motto TEXT,
ADD COLUMN IF NOT EXISTS current_profession VARCHAR(200),
ADD COLUMN IF NOT EXISTS current_company VARCHAR(200),
ADD COLUMN IF NOT EXISTS current_location VARCHAR(200),
ADD COLUMN IF NOT EXISTS social_media_facebook VARCHAR(200),
ADD COLUMN IF NOT EXISTS social_media_instagram VARCHAR(200),
ADD COLUMN IF NOT EXISTS social_media_twitter VARCHAR(200),
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
ADD COLUMN IF NOT EXISTS achievements TEXT[],
ADD COLUMN IF NOT EXISTS message_to_students TEXT;

-- Add new fields to staff_profiles table
ALTER TABLE staff_profiles 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS nickname VARCHAR(100),
ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS saying_motto TEXT,
ADD COLUMN IF NOT EXISTS office_assigned VARCHAR(200),
ADD COLUMN IF NOT EXISTS social_media_facebook VARCHAR(200),
ADD COLUMN IF NOT EXISTS social_media_instagram VARCHAR(200),
ADD COLUMN IF NOT EXISTS social_media_twitter VARCHAR(200),
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
ADD COLUMN IF NOT EXISTS achievements TEXT[];

-- Add new fields to utility_profiles table (maintenance staff)
ALTER TABLE utility_profiles 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS nickname VARCHAR(100),
ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS saying_motto TEXT,
ADD COLUMN IF NOT EXISTS office_assigned VARCHAR(200),
ADD COLUMN IF NOT EXISTS social_media_facebook VARCHAR(200),
ADD COLUMN IF NOT EXISTS social_media_instagram VARCHAR(200),
ADD COLUMN IF NOT EXISTS social_media_twitter VARCHAR(200),
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
ADD COLUMN IF NOT EXISTS achievements TEXT[];

-- Create tables for dynamic academic data management
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL, -- 'elementary', 'junior_high', 'senior_high', 'college', 'graduate'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS sections (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    year_level VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

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

-- Insert default sections
INSERT INTO sections (program_id, name, year_level)
SELECT p.id, 'STEM 1', 'Grade 11'
FROM programs p WHERE p.code = 'STEM'
ON CONFLICT DO NOTHING;

INSERT INTO sections (program_id, name, year_level)
SELECT p.id, 'STEM 2', 'Grade 12'
FROM programs p WHERE p.code = 'STEM'
ON CONFLICT DO NOTHING;

INSERT INTO sections (program_id, name, year_level)
SELECT p.id, 'CS-A', '1st Year'
FROM programs p WHERE p.code = 'BSCS'
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_profiles_age ON student_profiles(age);
CREATE INDEX IF NOT EXISTS idx_student_profiles_gender ON student_profiles(gender);
CREATE INDEX IF NOT EXISTS idx_faculty_profiles_age ON faculty_profiles(age);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_age ON alumni_profiles(age);
CREATE INDEX IF NOT EXISTS idx_staff_profiles_age ON staff_profiles(age);
CREATE INDEX IF NOT EXISTS idx_utility_profiles_age ON utility_profiles(age);

-- Add comments to document the new fields
COMMENT ON COLUMN student_profiles.age IS 'Student age';
COMMENT ON COLUMN student_profiles.nickname IS 'Student nickname or preferred name';
COMMENT ON COLUMN student_profiles.gender IS 'Student gender (Male, Female, Prefer not to say)';
COMMENT ON COLUMN student_profiles.birthday IS 'Student birthday';
COMMENT ON COLUMN student_profiles.address IS 'Student home address';
COMMENT ON COLUMN student_profiles.email IS 'Student email address';
COMMENT ON COLUMN student_profiles.phone IS 'Student phone number';
COMMENT ON COLUMN student_profiles.saying_motto IS 'Student personal saying or motto';
COMMENT ON COLUMN student_profiles.dream_job IS 'Student dream job or career aspiration';
COMMENT ON COLUMN student_profiles.father_guardian_name IS 'Father or guardian name';
COMMENT ON COLUMN student_profiles.mother_guardian_name IS 'Mother or guardian name';
COMMENT ON COLUMN student_profiles.social_media_facebook IS 'Facebook username or profile';
COMMENT ON COLUMN student_profiles.social_media_instagram IS 'Instagram username';
COMMENT ON COLUMN student_profiles.social_media_twitter IS 'Twitter/X username';
COMMENT ON COLUMN student_profiles.profile_picture_url IS 'URL to profile picture';
COMMENT ON COLUMN student_profiles.achievements IS 'Array of student achievements';
COMMENT ON COLUMN student_profiles.activities IS 'Array of student activities';

-- Log the migration
INSERT INTO schema_migrations (version, description, executed_at) 
VALUES ('v4_comprehensive_profile_fields', 'Added comprehensive profile fields for unified role-aware setup', NOW())
ON CONFLICT (version) DO NOTHING;
