const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const materialRoutes = require('./material.routes');
const groupRoutes = require('./group.routes');
const searchRoutes = require('./search.routes');
const subjectRoutes = require('./subject.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/materials', materialRoutes);
router.use('/groups', groupRoutes);
router.use('/search', searchRoutes);
router.use('/subjects', subjectRoutes);

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'StudyShare API is running',
        version: '2.0.0',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
