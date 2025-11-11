const { db } = require('../config/database');

class GroupModel {
    // Create new group
    static create(groupData) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO groups (name, description) VALUES (?, ?)';
            
            db.run(query, [groupData.name, groupData.description], function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint')) {
                        reject(new Error('Group name already exists'));
                    } else {
                        reject(err);
                    }
                } else {
                    resolve({ id: this.lastID, ...groupData });
                }
            });
        });
    }

    // Get all groups
    static getAll() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM groups ORDER BY created_at DESC';
            
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get group by ID
    static getById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM groups WHERE id = ?';
            
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Add member to group
    static addMember(groupId, memberName) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO group_members (group_id, member_name) VALUES (?, ?)';
            
            db.run(query, [groupId, memberName], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, groupId, memberName });
                }
            });
        });
    }

    // Get group members
    static getMembers(groupId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM group_members WHERE group_id = ? ORDER BY joined_at DESC';
            
            db.all(query, [groupId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = GroupModel;
