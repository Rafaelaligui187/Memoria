-- SQL schema for the complete database structure

-- Enable UUID extension if using PostgreSQL
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- School Years table
CREATE TABLE school_years (
    id VARCHAR(255) PRIMARY KEY,
    year_label VARCHAR(50) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    initials VARCHAR(10),
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'faculty', 'alumni', 'staff', 'utility', 'admin')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'banned')),
    school_id VARCHAR(100),
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Profiles table
CREATE TABLE student_profiles (
    id VARCHAR(255) PRIMARY KEY,
    school_year_id VARCHAR(255) REFERENCES school_years(id) ON DELETE CASCADE,
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
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'archived')),
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Faculty Profiles table
CREATE TABLE faculty_profiles (
    id VARCHAR(255) PRIMARY KEY,
    school_year_id VARCHAR(255) REFERENCES school_years(id) ON DELETE CASCADE,
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
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'archived')),
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alumni Profiles table
CREATE TABLE alumni_profiles (
    id VARCHAR(255) PRIMARY KEY,
    school_year_id VARCHAR(255) REFERENCES school_years(id) ON DELETE CASCADE,
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
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'archived')),
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff Profiles table
CREATE TABLE staff_profiles (
    id VARCHAR(255) PRIMARY KEY,
    school_year_id VARCHAR(255) REFERENCES school_years(id) ON DELETE CASCADE,
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
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'archived')),
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Utility Profiles table (same structure as staff)
CREATE TABLE utility_profiles (
    id VARCHAR(255) PRIMARY KEY,
    school_year_id VARCHAR(255) REFERENCES school_years(id) ON DELETE CASCADE,
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
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'archived')),
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Albums table
CREATE TABLE albums (
    id VARCHAR(255) PRIMARY KEY,
    school_year_id VARCHAR(255) REFERENCES school_years(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    privacy VARCHAR(50) DEFAULT 'public' CHECK (privacy IN ('public', 'private', 'hidden')),
    tags JSONB DEFAULT '[]',
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Photos table
CREATE TABLE photos (
    id VARCHAR(255) PRIMARY KEY,
    album_id VARCHAR(255) REFERENCES albums(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    caption TEXT,
    photographer VARCHAR(255),
    date_taken TIMESTAMP,
    location VARCHAR(255),
    visibility VARCHAR(50) DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Moderation Items table
CREATE TABLE moderation_items (
    id VARCHAR(255) PRIMARY KEY,
    school_year_id VARCHAR(255) REFERENCES school_years(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('profile', 'album', 'photo', 'edit')),
    target_id VARCHAR(255) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    submitted_by VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    moderated_by VARCHAR(255),
    moderated_at TIMESTAMP,
    rejection_reasons JSONB DEFAULT '[]',
    custom_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rejection Reasons table
CREATE TABLE rejection_reasons (
    id VARCHAR(255) PRIMARY KEY,
    reason VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    school_year_id VARCHAR(255) REFERENCES school_years(id) ON DELETE CASCADE -- NULL for global reasons
);

-- Reports table
CREATE TABLE reports (
    id VARCHAR(255) PRIMARY KEY,
    school_year_id VARCHAR(255) REFERENCES school_years(id) ON DELETE CASCADE,
    reporter_id VARCHAR(255) NOT NULL,
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('profile', 'album', 'photo', 'comment')),
    target_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'escalated')),
    resolved_by VARCHAR(255),
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('approval', 'rejection', 'general', 'report')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email Queue table
CREATE TABLE email_queue (
    id VARCHAR(255) PRIMARY KEY,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    sent_at TIMESTAMP,
    error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs table
CREATE TABLE audit_logs (
    id VARCHAR(255) PRIMARY KEY,
    school_year_id VARCHAR(255) REFERENCES school_years(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    target_type VARCHAR(100),
    target_id VARCHAR(255),
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- School History table
CREATE TABLE school_history (
    id VARCHAR(255) PRIMARY KEY,
    school_year_id VARCHAR(255) REFERENCES school_years(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    is_published BOOLEAN DEFAULT false,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- School History Versions table (for versioning)
CREATE TABLE school_history_versions (
    id VARCHAR(255) PRIMARY KEY,
    history_id VARCHAR(255) REFERENCES school_history(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    version INTEGER NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_student_profiles_school_year ON student_profiles(school_year_id);
CREATE INDEX idx_student_profiles_status ON student_profiles(status);
CREATE INDEX idx_faculty_profiles_school_year ON faculty_profiles(school_year_id);
CREATE INDEX idx_alumni_profiles_school_year ON alumni_profiles(school_year_id);
CREATE INDEX idx_staff_profiles_school_year ON staff_profiles(school_year_id);
CREATE INDEX idx_utility_profiles_school_year ON utility_profiles(school_year_id);
CREATE INDEX idx_albums_school_year ON albums(school_year_id);
CREATE INDEX idx_photos_album ON photos(album_id);
CREATE INDEX idx_moderation_items_school_year ON moderation_items(school_year_id);
CREATE INDEX idx_moderation_items_status ON moderation_items(status);
CREATE INDEX idx_reports_school_year ON reports(school_year_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_audit_logs_school_year ON audit_logs(school_year_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- Insert default school years
INSERT INTO school_years (id, year_label, start_date, end_date, is_active) VALUES
('1', '2024-2025', '2024-08-01', '2025-07-31', true),
('2', '2023-2024', '2023-08-01', '2024-07-31', false);

-- Insert default rejection reasons
INSERT INTO rejection_reasons (id, reason, category, is_active) VALUES
('1', 'Inappropriate content', 'content', true),
('2', 'Incomplete information', 'data', true),
('3', 'Poor image quality', 'media', true),
('4', 'Duplicate entry', 'data', true),
('5', 'Violates community guidelines', 'content', true),
('6', 'Missing required fields', 'data', true),
('7', 'Other', 'general', true);
