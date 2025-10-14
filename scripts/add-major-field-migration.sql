-- Add major field to student profiles for BSED students
-- This script adds the major field to support BSED major selection

-- Add major field to student_profiles table
ALTER TABLE student_profiles 
ADD COLUMN IF NOT EXISTS major VARCHAR(100);

-- Add major field to faculty_profiles table (for consistency)
ALTER TABLE faculty_profiles 
ADD COLUMN IF NOT EXISTS major VARCHAR(100);

-- Add major field to alumni_profiles table (for consistency)
ALTER TABLE alumni_profiles 
ADD COLUMN IF NOT EXISTS major VARCHAR(100);

-- Add major field to staff_profiles table (for consistency)
ALTER TABLE staff_profiles 
ADD COLUMN IF NOT EXISTS major VARCHAR(100);

-- Add major field to utility_profiles table (for consistency)
ALTER TABLE utility_profiles 
ADD COLUMN IF NOT EXISTS major VARCHAR(100);

-- Create index for better performance on major field
CREATE INDEX IF NOT EXISTS idx_student_profiles_major ON student_profiles(major);

-- Update existing BSED records to have empty major field (optional)
-- This ensures existing BSED students can be updated with their major
UPDATE student_profiles 
SET major = '' 
WHERE course_program = 'BSED' AND major IS NULL;
