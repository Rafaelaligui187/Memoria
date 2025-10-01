-- Add new common fields to all profile tables
-- This script adds the new fields requested for role-based profile setup

-- Add new fields to student_profiles table
ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS nickname VARCHAR(100),
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS saying_motto TEXT,
ADD COLUMN IF NOT EXISTS dream_job VARCHAR(200),
ADD COLUMN IF NOT EXISTS father_guardian_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS mother_guardian_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS facebook VARCHAR(200),
ADD COLUMN IF NOT EXISTS instagram VARCHAR(200),
ADD COLUMN IF NOT EXISTS twitter VARCHAR(200);

-- Add new fields to faculty_profiles table
ALTER TABLE faculty_profiles 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS nickname VARCHAR(100),
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS saying_motto TEXT,
ADD COLUMN IF NOT EXISTS dream_job VARCHAR(200),
ADD COLUMN IF NOT EXISTS facebook VARCHAR(200),
ADD COLUMN IF NOT EXISTS instagram VARCHAR(200),
ADD COLUMN IF NOT EXISTS twitter VARCHAR(200);

-- Add new fields to alumni_profiles table
ALTER TABLE alumni_profiles 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS nickname VARCHAR(100),
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS saying_motto TEXT,
ADD COLUMN IF NOT EXISTS dream_job VARCHAR(200),
ADD COLUMN IF NOT EXISTS facebook VARCHAR(200),
ADD COLUMN IF NOT EXISTS instagram VARCHAR(200),
ADD COLUMN IF NOT EXISTS twitter VARCHAR(200);

-- Add new fields to staff_profiles table
ALTER TABLE staff_profiles 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS nickname VARCHAR(100),
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS saying_motto TEXT,
ADD COLUMN IF NOT EXISTS dream_job VARCHAR(200),
ADD COLUMN IF NOT EXISTS facebook VARCHAR(200),
ADD COLUMN IF NOT EXISTS instagram VARCHAR(200),
ADD COLUMN IF NOT EXISTS twitter VARCHAR(200);

-- Add new fields to utility_profiles table (maintenance staff)
ALTER TABLE utility_profiles 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS nickname VARCHAR(100),
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS saying_motto TEXT,
ADD COLUMN IF NOT EXISTS dream_job VARCHAR(200),
ADD COLUMN IF NOT EXISTS facebook VARCHAR(200),
ADD COLUMN IF NOT EXISTS instagram VARCHAR(200),
ADD COLUMN IF NOT EXISTS twitter VARCHAR(200);

-- Create indexes for better performance on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_student_profiles_age ON student_profiles(age);
CREATE INDEX IF NOT EXISTS idx_faculty_profiles_age ON faculty_profiles(age);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_age ON alumni_profiles(age);
CREATE INDEX IF NOT EXISTS idx_staff_profiles_age ON staff_profiles(age);
CREATE INDEX IF NOT EXISTS idx_utility_profiles_age ON utility_profiles(age);

-- Add comments to document the new fields
COMMENT ON COLUMN student_profiles.age IS 'Student age';
COMMENT ON COLUMN student_profiles.nickname IS 'Student nickname or preferred name';
COMMENT ON COLUMN student_profiles.birthday IS 'Student birthday';
COMMENT ON COLUMN student_profiles.address IS 'Student home address';
COMMENT ON COLUMN student_profiles.saying_motto IS 'Student personal saying or motto';
COMMENT ON COLUMN student_profiles.dream_job IS 'Student dream job or career aspiration';
COMMENT ON COLUMN student_profiles.father_guardian_name IS 'Father or guardian name';
COMMENT ON COLUMN student_profiles.mother_guardian_name IS 'Mother or guardian name';
COMMENT ON COLUMN student_profiles.facebook IS 'Facebook username or profile';
COMMENT ON COLUMN student_profiles.instagram IS 'Instagram username';
COMMENT ON COLUMN student_profiles.twitter IS 'Twitter/X username';

-- Log the migration
INSERT INTO schema_migrations (version, description, executed_at) 
VALUES ('v3_role_based_profile_fields', 'Added common profile fields for role-based setup', NOW())
ON CONFLICT (version) DO NOTHING;
