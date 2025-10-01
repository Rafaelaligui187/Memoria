-- Update database schema to include new profile fields

-- Add new columns to student_profiles table
ALTER TABLE student_profiles 
ADD COLUMN nickname VARCHAR(255),
ADD COLUMN birthday DATE,
ADD COLUMN address TEXT,
ADD COLUMN parents_guardian_name VARCHAR(500),
ADD COLUMN dream_job VARCHAR(255),
ADD COLUMN section_block VARCHAR(100),
ADD COLUMN other_section_block VARCHAR(255);

-- Add new columns to faculty_profiles table
ALTER TABLE faculty_profiles 
ADD COLUMN nickname VARCHAR(255),
ADD COLUMN birthday DATE,
ADD COLUMN address TEXT;

-- Add new columns to alumni_profiles table
ALTER TABLE alumni_profiles 
ADD COLUMN nickname VARCHAR(255),
ADD COLUMN birthday DATE,
ADD COLUMN address TEXT;

-- Add new columns to staff_profiles table
ALTER TABLE staff_profiles 
ADD COLUMN nickname VARCHAR(255),
ADD COLUMN birthday DATE,
ADD COLUMN address TEXT;

-- Add new columns to utility_profiles table
ALTER TABLE utility_profiles 
ADD COLUMN nickname VARCHAR(255),
ADD COLUMN birthday DATE,
ADD COLUMN address TEXT;

-- Update existing records to have default values for new fields
UPDATE student_profiles SET 
  nickname = NULL,
  birthday = NULL,
  address = NULL,
  parents_guardian_name = NULL,
  dream_job = NULL,
  section_block = NULL,
  other_section_block = NULL
WHERE nickname IS NULL;

-- Create indexes for better performance on new fields
CREATE INDEX idx_student_profiles_birthday ON student_profiles(birthday);
CREATE INDEX idx_student_profiles_section_block ON student_profiles(section_block);
CREATE INDEX idx_faculty_profiles_birthday ON faculty_profiles(birthday);
CREATE INDEX idx_alumni_profiles_birthday ON alumni_profiles(birthday);
CREATE INDEX idx_staff_profiles_birthday ON staff_profiles(birthday);
CREATE INDEX idx_utility_profiles_birthday ON utility_profiles(birthday);
