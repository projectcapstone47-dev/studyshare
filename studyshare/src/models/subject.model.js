const { db } = require('../config/database');

class SubjectModel {
    // Create new subject
    static create(subjectData) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO subjects (name, department, semester) VALUES (?, ?, ?)';
            
            db.run(query, [subjectData.name, subjectData.department, subjectData.semester], function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint')) {
                        reject(new Error('Subject already exists'));
                    } else {
                        reject(err);
                    }
                } else {
                    resolve({ id: this.lastID, ...subjectData });
                }
            });
        });
    }

    // Get all subjects
    static getAll() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM subjects ORDER BY name ASC';
            
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get subjects by semester
    static getBySemester(semester) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM subjects WHERE semester = ? ORDER BY name ASC';
            
            db.all(query, [semester], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get unique subject names (for autocomplete)
    static getUniqueNames() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT DISTINCT name FROM subjects ORDER BY name ASC';
            
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => row.name));
                }
            });
        });
    }
}

module.exports = SubjectModel;
