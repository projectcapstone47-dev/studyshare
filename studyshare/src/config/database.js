const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || './database/studyshare.db';

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('📦 Connected to SQLite database');
    }
});

// Initialize database schema
const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Materials table
            db.run(`
                CREATE TABLE IF NOT EXISTS materials (
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
                    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
                )
            `, (err) => {
                if (err) reject(err);
            });

            // Groups table
            db.run(`
                CREATE TABLE IF NOT EXISTS groups (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL UNIQUE,
                    description TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) reject(err);
            });

            // Subjects table
            db.run(`
                CREATE TABLE IF NOT EXISTS subjects (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL UNIQUE,
                    department TEXT,
                    semester TEXT
                )
            `, (err) => {
                if (err) reject(err);
            });

            // Group members table (for tracking who belongs to which group)
            db.run(`
                CREATE TABLE IF NOT EXISTS group_members (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    group_id INTEGER NOT NULL,
                    member_name TEXT NOT NULL,
                    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
                )
            `, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('✅ Database schema initialized');
                    resolve();
                }
            });
        });
    });
};

module.exports = { db, initializeDatabase };
