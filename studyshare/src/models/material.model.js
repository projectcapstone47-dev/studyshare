const { db } = require('../config/database');

class MaterialModel {
    // Create new material
    static create(materialData) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO materials 
                (title, subject, semester, uploaded_by, visibility, group_id, 
                 file_path, file_name, file_type, file_size, user_id, is_verified, uploader_role)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const params = [
                materialData.title,
                materialData.subject,
                materialData.semester,
                materialData.uploadedBy,
                materialData.visibility || 'public',
                materialData.groupId || null,
                materialData.filePath,
                materialData.fileName,
                materialData.fileType,
                materialData.fileSize,
                materialData.userId || null, // NEW
                materialData.isVerified || 0, // NEW
                materialData.uploaderRole || 'student' // NEW
            ];

            db.run(query, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...materialData });
                }
            });
        });
    }

    // Get all public materials
    static getAll(filters = {}) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM materials WHERE visibility = "public"';
            const params = [];

            // Apply filters
            if (filters.subject) {
                query += ' AND subject = ?';
                params.push(filters.subject);
            }

            if (filters.semester) {
                query += ' AND semester = ?';
                params.push(filters.semester);
            }

            if (filters.uploaderRole) { // NEW
                query += ' AND uploader_role = ?';
                params.push(filters.uploaderRole);
            }

            if (filters.isVerified !== undefined) { // NEW
                query += ' AND is_verified = ?';
                params.push(filters.isVerified);
            }

            if (filters.search) {
                query += ' AND (title LIKE ? OR subject LIKE ? OR uploaded_by LIKE ?)';
                const searchTerm = `%${filters.search}%`;
                params.push(searchTerm, searchTerm, searchTerm);
            }

            query += ' ORDER BY upload_timestamp DESC';

            if (filters.limit) {
                query += ' LIMIT ?';
                params.push(filters.limit);
            }

            db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get material by ID
    static getById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM materials WHERE id = ?';
            
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Get materials by group
    static getByGroup(groupId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM materials 
                WHERE group_id = ? AND visibility = "group"
                ORDER BY upload_timestamp DESC
            `;
            
            db.all(query, [groupId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Increment download count
    static incrementDownloads(id) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE materials SET downloads_count = downloads_count + 1 WHERE id = ?';
            
            db.run(query, [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }

    // Delete material
    static delete(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM materials WHERE id = ?';
            
            db.run(query, [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }

    // Get statistics
    static getStats() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    COUNT(*) as total_materials,
                    SUM(downloads_count) as total_downloads,
                    COUNT(DISTINCT subject) as total_subjects,
                    SUM(CASE WHEN is_verified = 1 THEN 1 ELSE 0 END) as verified_materials,
                    SUM(CASE WHEN uploader_role = 'teacher' THEN 1 ELSE 0 END) as teacher_materials,
                    SUM(CASE WHEN uploader_role = 'student' THEN 1 ELSE 0 END) as student_materials
                FROM materials
            `;
            
            db.get(query, [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
}

module.exports = MaterialModel;
