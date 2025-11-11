require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./database/studyshare.db');

async function resetAdmin() {
    console.log('🔧 Resetting admin user...\n');

    try {
        // Step 1: Delete ALL admin users
        await new Promise((resolve, reject) => {
            db.run("DELETE FROM users WHERE role='admin'", (err) => {
                if (err) reject(err);
                else {
                    console.log('✅ Deleted old admin users');
                    resolve();
                }
            });
        });

        // Step 2: Generate fresh password hash
        const password = 'Admin@123';
        const hash = await bcrypt.hash(password, 10);
        console.log('✅ Generated fresh password hash');

        // Step 3: Insert new admin
        await new Promise((resolve, reject) => {
            const query = `INSERT INTO users (name, email, password, role, is_active) 
                          VALUES (?, ?, ?, ?, ?)`;
            
            db.run(query, ['System Admin', 'admin@studyshare.com', hash, 'admin', 1], (err) => {
                if (err) reject(err);
                else {
                    console.log('✅ Created new admin user');
                    resolve();
                }
            });
        });

        // Step 4: Verify
        db.get("SELECT id, email, role FROM users WHERE email='admin@studyshare.com'", [], (err, row) => {
            if (err) {
                console.error('❌ Error:', err);
            } else if (row) {
                console.log('\n✅ Admin user created successfully!\n');
                console.log('📝 Login Credentials:');
                console.log('   Email: admin@studyshare.com');
                console.log('   Password: Admin@123');
                console.log('\n🚀 Restart server and try logging in!\n');
            } else {
                console.error('❌ Admin user not found after creation');
            }
            
            db.close();
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        db.close();
    }
}

resetAdmin();
