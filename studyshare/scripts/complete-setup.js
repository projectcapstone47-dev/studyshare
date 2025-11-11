require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || './database/studyshare.db';

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    }
    console.log('📦 Connected to SQLite database');
});

async function setupDatabase() {
    console.log('🔧 Setting up complete database...\n');

    const queries = [
        // 1. Drop existing tables if they exist (fresh start)
        `DROP TABLE IF EXISTS notifications`,
        `DROP TABLE IF EXISTS departments`,
        `DROP TABLE IF EXISTS users`,
        
        // 2. Materials table (update existing or create)
        `CREATE TABLE IF NOT EXISTS materials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            subject TEXT NOT NULL,
            semester TEXT NOT NULL,
            uploaded_by TEXT NOT NULL,
            visibility TEXT NOT NULL DEFAULT 'public',
            group_id INTEGER,
            file_path TEXT NOT NULL,
            file_name TEXT NOT NULL,
            file_type TEXT,
            file_size INTEGER,
            upload_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            downloads_count INTEGER DEFAULT 0,
            user_id INTEGER,
            is_verified INTEGER DEFAULT 0,
            uploader_role TEXT
        )`,

        // 3. Groups table
        `CREATE TABLE IF NOT EXISTS groups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

        // 4. Subjects table
        `CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            department TEXT,
            semester TEXT
        )`,

        // 5. Group members table
        `CREATE TABLE IF NOT EXISTS group_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            group_id INTEGER NOT NULL,
            member_name TEXT NOT NULL,
            joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
        )`,

        // 6. Users table (CRITICAL - CREATE FRESH)
        `CREATE TABLE users (
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
        )`,

        // 7. Notifications table
        `CREATE TABLE notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            message TEXT NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('info', 'success', 'warning', 'error')),
            is_read INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,

        // 8. Departments table
        `CREATE TABLE departments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            code TEXT NOT NULL UNIQUE,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

        // Indexes for materials
        `CREATE INDEX IF NOT EXISTS idx_materials_subject ON materials(subject)`,
        `CREATE INDEX IF NOT EXISTS idx_materials_semester ON materials(semester)`,
        `CREATE INDEX IF NOT EXISTS idx_materials_user_id ON materials(user_id)`,
        `CREATE INDEX IF NOT EXISTS idx_materials_is_verified ON materials(is_verified)`,
        `CREATE INDEX IF NOT EXISTS idx_materials_uploader_role ON materials(uploader_role)`,

        // Indexes for users
        `CREATE INDEX idx_users_email ON users(email)`,
        `CREATE INDEX idx_users_role ON users(role)`,
        `CREATE INDEX idx_users_is_active ON users(is_active)`,

        // Indexes for notifications
        `CREATE INDEX idx_notifications_user_id ON notifications(user_id)`,

        // Insert default admin user (password: Admin@123)
        `INSERT INTO users (name, email, password, role) VALUES 
         ('System Admin', 'admin@studyshare.com', 
          '$2a$10$XqWLzF4P.zT0yJVKZLvWXOMBGPFYKzYYxGzF5OZxPYqT1r8MRZc5u', 'admin')`,

        // Insert departments
        `INSERT INTO departments (name, code, description) VALUES
         ('Computer Science and Engineering', 'CSE', 'Computer Science and Engineering Department'),
         ('Information Technology', 'IT', 'Information Technology Department'),
         ('Electronics and Communication', 'ECE', 'Electronics and Communication Engineering'),
         ('Mechanical Engineering', 'ME', 'Mechanical Engineering Department'),
         ('Civil Engineering', 'CE', 'Civil Engineering Department'),
         ('Electrical Engineering', 'EE', 'Electrical Engineering Department')`
    ];

    try {
        // Execute all queries sequentially
        for (let i = 0; i < queries.length; i++) {
            await new Promise((resolve, reject) => {
                db.run(queries[i], (err) => {
                    if (err) {
                        console.error(`❌ Query ${i + 1} failed:`, err.message);
                        console.error('Query was:', queries[i].substring(0, 100) + '...');
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }

        console.log('✅ All tables created successfully!\n');
        
        // Verify tables
        db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", [], (err, tables) => {
            if (!err) {
                console.log('📊 Database Tables:');
                tables.forEach(table => {
                    console.log(`   ✓ ${table.name}`);
                });
            }
            
            console.log('\n🎉 Database setup complete!\n');
            console.log('📝 Default Admin Credentials:');
            console.log('   Email: admin@studyshare.com');
            console.log('   Password: Admin@123\n');
            console.log('✅ You can now run: npm start\n');
            
            db.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Setup failed:', error);
        db.close();
        process.exit(1);
    }
}

setupDatabase();
