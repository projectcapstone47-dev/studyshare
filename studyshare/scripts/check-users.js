require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/studyshare.db');

db.all("SELECT id, name, email, role, password, is_active FROM users", [], (err, rows) => {
    if (err) {
        console.error('Error:', err);
        return;
    }
    
    console.log('\n📊 All Users in Database:\n');
    rows.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log(`Password Hash: ${user.password.substring(0, 20)}...`);
        console.log(`Active: ${user.is_active}`);
        console.log('---');
    });
    
    db.close();
});
