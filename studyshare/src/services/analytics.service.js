const { db } = require('../config/database');

class AnalyticsService {
    // Get most downloaded materials
    static getMostDownloaded(limit = 10) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM materials 
                WHERE visibility = 'public'
                ORDER BY downloads_count DESC 
                LIMIT ?
            `;
            
            db.all(query, [limit], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Get materials by date range
    static getMaterialsByDateRange(startDate, endDate) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM materials 
                WHERE upload_timestamp BETWEEN ? AND ?
                ORDER BY upload_timestamp DESC
            `;
            
            db.all(query, [startDate, endDate], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Get subject-wise statistics
    static getSubjectStats() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    subject,
                    COUNT(*) as material_count,
                    SUM(downloads_count) as total_downloads
                FROM materials
                WHERE visibility = 'public'
                GROUP BY subject
                ORDER BY material_count DESC
            `;
            
            db.all(query, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Get semester-wise statistics
    static getSemesterStats() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    semester,
                    COUNT(*) as material_count,
                    SUM(downloads_count) as total_downloads
                FROM materials
                WHERE visibility = 'public'
                GROUP BY semester
                ORDER BY semester ASC
            `;
            
            db.all(query, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

module.exports = AnalyticsService;
