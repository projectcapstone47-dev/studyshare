// src/config/database.js
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { spawnSync } = require('child_process');

const dbFile = process.env.DATABASE_FILE || path.join(process.cwd(), 'database', 'studyshare.db');

function getDb() {
  // open in serialized mode to avoid concurrency issues during migrations
  const db = new sqlite3.Database(dbFile);
  return db;
}

async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    try {
      // Ensure folder exists
      const dbDir = path.dirname(dbFile);
      const fs = require('fs');
      if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

      // Run migrations synchronously using node script
      console.log('Running migrations via scripts/run-migrations.js');
      const result = spawnSync('node', [path.join(process.cwd(), 'scripts', 'run-migrations.js')], {
        stdio: 'inherit',
        env: process.env,
        shell: false,
      });

      if (result.status !== 0) {
        return reject(new Error('Migrations failed. See logs above.'));
      }

      // open the DB after migrations
      const db = getDb();
      // optional: you can test a simple query to confirm DB responds
      db.get("SELECT name FROM sqlite_master WHERE type='table' LIMIT 1", (err/*, row*/) => {
        if (err) {
          db.close();
          return reject(err);
        }
        db.close();
        console.log('Database initialized at', dbFile);
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  dbFile,
  getDb,
  initializeDatabase,
};
