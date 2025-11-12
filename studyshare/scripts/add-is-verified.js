// scripts/add-is-verified.js
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = process.env.DATABASE_FILE || path.join(process.cwd(), 'database', 'studyshare.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('🔍 Checking if "is_verified" column exists in materials table...');

  db.all("PRAGMA table_info(materials);", (err, rows) => {
    if (err) {
      console.error('❌ Error reading schema:', err);
      process.exit(1);
    }

    const cols = rows.map(r => r.name);
    if (!cols.includes('is_verified')) {
      console.log('🧩 Adding "is_verified" column to materials...');
      db.run("ALTER TABLE materials ADD COLUMN is_verified INTEGER DEFAULT 0", (err2) => {
        if (err2) {
          console.error('❌ Failed to add column:', err2);
          process.exit(1);
        } else {
          console.log('✅ Column "is_verified" added successfully.');
          process.exit(0);
        }
      });
    } else {
      console.log('✅ "is_verified" column already exists. No changes needed.');
      process.exit(0);
    }
  });
});
