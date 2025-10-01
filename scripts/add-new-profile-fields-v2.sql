-- Add new common fields to all profile tables
-- Migration to add new fields: age, nickname, birthday, address, motto/saying, dream_job, social media, and update parent/guardian fields

-- Add new fields to student_profiles table
ALTER TABLE student_profiles 
ADD COLUMN age INTEGER,
ADD COLUMN nickname VARCHAR(255),
ADD COLUMN birthday DATE,
ADD COLUMN address TEXT,
ADD COLUMN motto_saying TEXT,
ADD COLUMN dream_job VARCHAR(255),
ADD COLUMN facebook_url VARCHAR(255),
ADD COLUMN instagram_url VARCHAR(255),
ADD COLUMN twitter_url VARCHAR(255),
ADD COLUMN father_guardian_name VARCHAR(255),
ADD COLUMN mother_guardian_name VARCHAR(255);

-- Add new fields to faculty_profiles table
ALTER TABLE faculty_profiles 
ADD COLUMN age INTEGER,
ADD COLUMN nickname VARCHAR(255),
ADD COLUMN birthday DATE,
ADD COLUMN address TEXT,
ADD COLUMN motto_saying TEXT,
ADD COLUMN dream_job VARCHAR(255),
ADD COLUMN facebook_url VARCHAR(255),
ADD COLUMN instagram_url VARCHAR(255),
ADD COLUMN twitter_url VARCHAR(255);

-- Add new fields to alumni_profiles table
ALTER TABLE alumni_profiles 
ADD COLUMN age INTEGER,
ADD COLUMN nickname VARCHAR(255),
ADD COLUMN birthday DATE,
ADD COLUMN address TEXT,
ADD COLUMN motto_saying TEXT,
ADD COLUMN dream_job VARCHAR(255),
ADD COLUMN facebook_url VARCHAR(255),
ADD COLUMN instagram_url VARCHAR(255),
ADD COLUMN twitter_url VARCHAR(255);

-- Add new fields to staff_profiles table
ALTER TABLE staff_profiles 
ADD COLUMN age INTEGER,
ADD COLUMN nickname VARCHAR(255),
ADD COLUMN birthday DATE,
ADD COLUMN address TEXT,
ADD COLUMN motto_saying TEXT,
ADD COLUMN dream_job VARCHAR(255),
ADD COLUMN facebook_url VARCHAR(255),
ADD COLUMN instagram_url VARCHAR(255),
ADD COLUMN twitter_url VARCHAR(255);

-- Add new fields to utility_profiles table
ALTER TABLE utility_profiles 
ADD COLUMN age INTEGER,
ADD COLUMN nickname VARCHAR(255),
ADD COLUMN birthday DATE,
ADD COLUMN address TEXT,
ADD COLUMN motto_saying TEXT,
ADD COLUMN dream_job VARCHAR(255),
ADD COLUMN facebook_url VARCHAR(255),
ADD COLUMN instagram_url VARCHAR(255),
ADD COLUMN twitter_url VARCHAR(255);

-- Add indexes for better performance on new fields
CREATE INDEX idx_student_profiles_age ON student_profiles(age);
CREATE INDEX idx_student_profiles_birthday ON student_profiles(birthday);
CREATE INDEX idx_faculty_profiles_age ON faculty_profiles(age);
CREATE INDEX idx_faculty_profiles_birthday ON faculty_profiles(birthday);
CREATE INDEX idx_alumni_profiles_age ON alumni_profiles(age);
CREATE INDEX idx_alumni_profiles_birthday ON alumni_profiles(birthday);
CREATE INDEX idx_staff_profiles_age ON staff_profiles(age);
CREATE INDEX idx_staff_profiles_birthday ON staff_profiles(birthday);
CREATE INDEX idx_utility_profiles_age ON utility_profiles(age);
CREATE INDEX idx_utility_profiles_birthday ON utility_profiles(birthday);
