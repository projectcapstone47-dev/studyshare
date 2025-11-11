require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { db } = require('../src/config/database');

const UPLOAD_PATH = process.env.UPLOAD_PATH || './uploads/materials';
const MAX_AGE_DAYS = 365; // Delete files older than 1 year

async function cleanupOldFiles() {
    console.log('🧹 Starting cleanup of old files...');

    try {
        const files = fs.readdirSync(UPLOAD_PATH);
        const now = Date.now();
        let deletedCount = 0;

        for (const file of files) {
            const filePath = path.join(UPLOAD_PATH, file);
            const stats = fs.statSync(filePath);
            const fileAge = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);

            if (fileAge > MAX_AGE_DAYS) {
                // Check if file is in database
                const material = await new Promise((resolve, reject) => {
                    db.get('SELECT id FROM materials WHERE file_path = ?', [file], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                });

                if (!material) {
                    // File not in database, safe to delete
                    fs.unlinkSync(filePath);
                    deletedCount++;
                    console.log(`Deleted: ${file}`);
                }
            }
        }

        console.log(`✅ Cleanup complete. Deleted ${deletedCount} old files.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        process.exit(1);
    }
}

cleanupOldFiles();
