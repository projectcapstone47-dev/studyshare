// scripts/run-migrations.js
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbFile = process.env.DATABASE_FILE || path.join(process.cwd(), 'database', 'studyshare.db');
const migrationsDir = path.join(process.cwd(), 'database', 'migrations');

function runSql(db, sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) {
        // For ALTER TABLE ADD COLUMN, SQLite will error if column exists.
        // We'll surface the error but not fail for "duplicate column" or "already exists" types.
        const msg = String(err.message).toLowerCase();
        if (msg.includes('duplicate column') || msg.includes('already exists') || msg.includes('has no column named')) {
          console.warn('Migration warning (ignored):', err.message);
          return resolve(); // ignore and continue
        }
        return reject(err);
      }
      resolve();
    });
  });
}

async function runAll() {
  if (!fs.existsSync(migrationsDir)) {
    console.log('No migrations directory found:', migrationsDir);
    process.exit(0);
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort(); // rely on numeric prefix

  if (files.length === 0) {
    console.log('No migration files found.');
    process.exit(0);
  }

  // ensure directory for DB exists
  const dbDir = path.dirname(dbFile);
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

  const db = new sqlite3.Database(dbFile);
  try {
    // run each file sequentially
    for (const f of files) {
      const fp = path.join(migrationsDir, f);
      const sql = fs.readFileSync(fp, 'utf8');
      console.log('Running migration:', f);
      await runSql(db, sql);
    }
    console.log('✅ All migrations executed (or safely ignored).');
    db.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    db.close();
    process.exit(1);
  }
}

runAll();
