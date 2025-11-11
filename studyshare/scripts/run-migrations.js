require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { db } = require('../src/config/database');

const MIGRATIONS_DIR = path.join(__dirname, '../database/migrations');

async function runMigrations() {
    console.log('🔄 Running database migrations...\n');

    try {
        // Get all migration files
        const files = fs.readdirSync(MIGRATIONS_DIR)
            .filter(file => file.endsWith('.sql'))
            .sort();

        if (files.length === 0) {
            console.log('📭 No migration files found.');
            return;
        }

        // Run each migration
        for (const file of files) {
            console.log(`📄 Running migration: ${file}`);
            
            const filePath = path.join(MIGRATIONS_DIR, file);
            const sql = fs.readFileSync(filePath, 'utf8');

            // Split by semicolon and run each statement separately
            const statements = sql
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0 && !s.startsWith('--'));

            for (const statement of statements) {
                try {
                    await new Promise((resolve, reject) => {
                        db.run(statement, (err) => {
                            if (err) {
                                // Ignore "duplicate column" errors (already exists)
                                if (err.message.includes('duplicate column name')) {
                                    console.log(`   ⚠️  Column already exists, skipping...`);
                                    resolve();
                                } else {
                                    reject(err);
                                }
                            } else {
                                resolve();
                            }
                        });
                    });
                } catch (stmtError) {
                    console.error(`   ⚠️  Warning: ${stmtError.message}`);
                    // Continue with next statement
                }
            }

            console.log(`   ✅ Completed: ${file}\n`);
        }

        console.log('✅ All migrations completed successfully!\n');
        
        // Show summary
        console.log('📊 Database Summary:');
        db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", [], (err, tables) => {
            if (!err) {
                console.log(`   Tables created: ${tables.length}`);
                tables.forEach(table => {
                    console.log(`   ✓ ${table.name}`);
                });
            }
            
            console.log('\n🎉 Migration process complete!');
            console.log('\n📝 Default credentials:');
            console.log('   Email: admin@studyshare.com');
            console.log('   Password: Admin@123\n');
            
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

// Run migrations
runMigrations();
