-- =====================================================================
-- LÉARGAS ENERGY PARTNERS - DATABASE SCHEMA DEFINITION
-- Compatible with MySQL 8.x / MySQL 9.x & MySQL Workbench
-- =====================================================================

CREATE DATABASE IF NOT EXISTS leargas_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE leargas_db;

-- 1. Users & Authentication table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_ADMIN',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_username (username),
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Blog Posts & CMS table
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(30) DEFAULT '#1677ff',
    display_order INT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Investment insights',
    author VARCHAR(100) DEFAULT 'LÉARGAS Editorial',
    reading_time_minutes INT DEFAULT 5,
    cover_image_url VARCHAR(500) DEFAULT '/images/wind.jpg',
    background_color VARCHAR(7) NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    published_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_posts_slug (slug),
    INDEX idx_posts_status_published (status, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Partner Consultations & CRM Leads table
CREATE TABLE IF NOT EXISTS enquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    company VARCHAR(150),
    role VARCHAR(100),
    topic VARCHAR(100) NOT NULL,
    project_stage VARCHAR(100),
    indicative_capacity VARCHAR(100),
    message TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'NEW',
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_enquiries_status (status),
    INDEX idx_enquiries_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Media & Uploads registry table
CREATE TABLE IF NOT EXISTS media_files (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    uploaded_by BIGINT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default initial administrator (password: admin123, BCrypt encoded)
INSERT INTO users (username, email, password_hash, full_name, role, is_active)
SELECT 'admin', 'admin@leargasenergy.com', '$2b$10$9ytM8ORt/kLqzZFlA6qdOuR800g7SbKl.75nrFEGSDUILGBrNVLKG', 'LÉARGAS Administrator', 'ROLE_ADMIN', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');
