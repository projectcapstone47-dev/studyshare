const { db } = require('../config/database');

class UserModel {
    // Create new user
    static create(userData) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO users (name, email, password, role, department, semester, phone)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const params = [
                userData.name,
                userData.email,
                userData.password,
                userData.role,
                userData.department || null,
                userData.semester || null,
                userData.phone || null
            ];

            db.run(query, params, function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint')) {
                        reject(new Error('Email already registered'));
                    } else {
                        reject(err);
                    }
                } else {
                    resolve({ id: this.lastID, ...userData });
                }
            });
        });
    }

    // Find user by email
    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE email = ?';
            
            db.get(query, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row || null);
                }
            });
        });
    }

    // Find user by ID
    static findById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE id = ?';
            
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row || null);
                }
            });
        });
    }

    // Get all users (admin only)
    static getAll(filters = {}) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT id, name, email, role, department, semester, phone, is_active, created_at, last_login FROM users';
            const params = [];

            // Apply filters
            const conditions = [];
            
            if (filters.role) {
                conditions.push('role = ?');
                params.push(filters.role);
            }
            
            if (filters.department) {
                conditions.push('department = ?');
                params.push(filters.department);
            }
            
            if (filters.semester) {
                conditions.push('semester = ?');
                params.push(filters.semester);
            }

            if (filters.is_active !== undefined) {
                conditions.push('is_active = ?');
                params.push(filters.is_active);
            }

            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            query += ' ORDER BY created_at DESC';

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

    // Update user profile
    static update(id, userData) {
        return new Promise((resolve, reject) => {
            const fields = [];
            const params = [];

            // Only update provided fields
            if (userData.name !== undefined) {
                fields.push('name = ?');
                params.push(userData.name);
            }
            if (userData.email !== undefined) {
                fields.push('email = ?');
                params.push(userData.email);
            }
            if (userData.department !== undefined) {
                fields.push('department = ?');
                params.push(userData.department);
            }
            if (userData.semester !== undefined) {
                fields.push('semester = ?');
                params.push(userData.semester);
            }
            if (userData.phone !== undefined) {
                fields.push('phone = ?');
                params.push(userData.phone);
            }
            if (userData.profile_picture !== undefined) {
                fields.push('profile_picture = ?');
                params.push(userData.profile_picture);
            }

            if (fields.length === 0) {
                return resolve({ message: 'No fields to update' });
            }

            params.push(id);
            const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

            db.run(query, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }

    // Update password
    static updatePassword(id, hashedPassword) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE users SET password = ? WHERE id = ?';
            
            db.run(query, [hashedPassword, id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }

    // Update last login timestamp
    static updateLastLogin(id) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE users SET last_login = datetime("now") WHERE id = ?';
            
            db.run(query, [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }

    // Deactivate user (soft delete)
    static deactivate(id) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE users SET is_active = 0 WHERE id = ?';
            
            db.run(query, [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }

    // Activate user
    static activate(id) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE users SET is_active = 1 WHERE id = ?';
            
            db.run(query, [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }

    // Delete user permanently
    static delete(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM users WHERE id = ?';
            
            db.run(query, [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }

    // Get user statistics
    static getStats() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    COUNT(*) as total_users,
                    SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) as total_students,
                    SUM(CASE WHEN role = 'teacher' THEN 1 ELSE 0 END) as total_teachers,
                    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users
                FROM users
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

    // Search users
    static search(searchTerm) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT id, name, email, role, department, semester
                FROM users 
                WHERE is_active = 1 AND (
                    name LIKE ? OR 
                    email LIKE ? OR 
                    department LIKE ?
                )
                ORDER BY name ASC
                LIMIT 20
            `;
            
            const searchPattern = `%${searchTerm}%`;
            
            db.all(query, [searchPattern, searchPattern, searchPattern], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = UserModel;
