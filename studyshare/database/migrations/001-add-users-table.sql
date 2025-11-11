-- Users table for authentication and user management
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('student', 'teacher', 'admin')),
    department TEXT,
    semester TEXT,
    phone TEXT,
    profile_picture TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Insert default admin user (password: Admin@123)
INSERT OR IGNORE INTO users (name, email, password, role)
VALUES (
    'System Admin',
    'admin@studyshare.com',
    '$2a$10$XqWLzF4P.zT0yJVKZLvWXOMBGPFYKzYYxGzF5OZxPYqT1r8MRZc5u',
    'admin'
);
