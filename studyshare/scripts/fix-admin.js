require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = './database/studyshare.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    }
    console.log('📦 Connected to database');
});

// Delete old admin and create new one
const queries = [
    "DELETE FROM users WHERE email='admin@studyshare.com'",
    `INSERT INTO users (name, email, password, role, is_active) 
     VALUES ('System Admin', 'admin@studyshare.com', 
     '$2a$10$XqWLzF4P.zT0yJVKZLvWXOMBGPFYKzYYxGzF5OZxPYqT1r8MRZc5u', 'admin', 1)`
];

async function fixAdmin() {
    try {
        for (const query of queries) {
            await new Promise((resolve, reject) => {
                db.run(query, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }

        console.log('✅ Admin user fixed successfully!');
        console.log('\n📝 Admin Credentials:');
        console.log('   Email: admin@studyshare.com');
        console.log('   Password: Admin@123\n');
        
        db.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        db.close();
        process.exit(1);
    }
}

fixAdmin();
