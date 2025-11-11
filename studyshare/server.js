require('dotenv').config();
const app = require('./src/app');
const { initializeDatabase } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Initialize database before starting server
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ StudyShare server running on http://localhost:${PORT}`);
            console.log(`📚 Upload materials at http://localhost:${PORT}/upload.html`);
            console.log(`🔍 Browse materials at http://localhost:${PORT}/browse.html`);
        });
    })
    .catch((err) => {
        console.error('❌ Failed to initialize database:', err);
        process.exit(1);
    });
