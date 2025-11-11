-- Departments table for organization
CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_departments_code ON departments(code);

-- Insert common engineering departments
INSERT OR IGNORE INTO departments (name, code, description) VALUES
('Computer Science and Engineering', 'CSE', 'Computer Science and Engineering Department'),
('Information Technology', 'IT', 'Information Technology Department'),
('Electronics and Communication', 'ECE', 'Electronics and Communication Engineering'),
('Mechanical Engineering', 'ME', 'Mechanical Engineering Department'),
('Civil Engineering', 'CE', 'Civil Engineering Department'),
('Electrical Engineering', 'EE', 'Electrical Engineering Department');
