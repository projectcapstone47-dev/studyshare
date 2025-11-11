-- Update materials table - Add user reference and verification fields
-- Note: SQLite doesn't support adding multiple columns in one statement

-- Add user_id column if not exists
ALTER TABLE materials ADD COLUMN user_id INTEGER;

-- Add is_verified column if not exists  
ALTER TABLE materials ADD COLUMN is_verified INTEGER DEFAULT 0;

-- Add uploader_role column if not exists
ALTER TABLE materials ADD COLUMN uploader_role TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_materials_user_id ON materials(user_id);
CREATE INDEX IF NOT EXISTS idx_materials_is_verified ON materials(is_verified);
CREATE INDEX IF NOT EXISTS idx_materials_uploader_role ON materials(uploader_role);
