require('dotenv').config();
const { db } = require('../src/config/database');

const sampleSubjects = [
    { name: 'Data Structures', department: 'Computer Science', semester: '3' },
    { name: 'Computer Networks', department: 'Computer Science', semester: '5' },
    { name: 'Database Management Systems', department: 'Computer Science', semester: '5' },
    { name: 'Operating Systems', department: 'Computer Science', semester: '4' },
    { name: 'Software Engineering', department: 'Computer Science', semester: '6' }
];

const sampleGroups = [
    { name: 'CSE Semester 5 - Group A', description: 'Study group for 5th semester CSE students' },
    { name: 'IT Department - Batch 2023', description: 'IT department collaboration group' }
];

async function seedData() {
    console.log('🌱 Seeding sample data...');

    try {
        // Seed subjects
        for (const subject of sampleSubjects) {
            await new Promise((resolve, reject) => {
                db.run(
                    'INSERT OR IGNORE INTO subjects (name, department, semester) VALUES (?, ?, ?)',
                    [subject.name, subject.department, subject.semester],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        }
        console.log('✅ Subjects seeded');

        // Seed groups
        for (const group of sampleGroups) {
            await new Promise((resolve, reject) => {
                db.run(
                    'INSERT OR IGNORE INTO groups (name, description) VALUES (?, ?)',
                    [group.name, group.description],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        }
        console.log('✅ Groups seeded');

        console.log('✅ Sample data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seedData();
