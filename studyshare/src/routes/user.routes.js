const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/roleCheck.middleware');

// Protected routes (all require authentication)
router.use(authenticateToken);

// User's own profile
router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);

// Search users
router.get('/search', UserController.searchUsers);

// Get user by ID (self or admin)
router.get('/:id', UserController.getUserById);

// Admin-only routes
router.get('/', requireAdmin, UserController.getAllUsers);
router.get('/role/:role', requireAdmin, UserController.getUsersByRole);
router.get('/stats/overview', requireAdmin, UserController.getStatistics);
router.put('/:id/deactivate', requireAdmin, UserController.deactivateUser);
router.put('/:id/activate', requireAdmin, UserController.activateUser);
router.delete('/:id', requireAdmin, UserController.deleteUser);

module.exports = router;
