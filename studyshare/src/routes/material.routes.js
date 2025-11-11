const express = require('express');
const router = express.Router();
const MaterialController = require('../controllers/material.controller');
const upload = require('../config/multer');
const { uploadLimiter } = require('../middleware/rateLimiter');
const { validateFileUpload, validateMaterialData } = require('../middleware/fileValidation');
const { authenticateToken, optionalAuth } = require('../middleware/auth.middleware');
const { canUpload, canDelete, markMaterialType } = require('../middleware/uploadPermission');

// Public routes (no auth required)
router.get('/', optionalAuth, MaterialController.getAllMaterials);
router.get('/stats/overview', MaterialController.getStatistics);

// Protected routes (auth required)
router.post(
    '/upload',
    authenticateToken,
    canUpload,
    uploadLimiter,
    upload.single('material'),
    validateFileUpload,
    validateMaterialData,
    markMaterialType,
    MaterialController.uploadMaterial
);

router.get('/:id', optionalAuth, MaterialController.getMaterialById);
router.get('/:id/download', MaterialController.downloadMaterial);

// Delete material (owner or admin only)
router.delete('/:id', authenticateToken, canDelete, MaterialController.deleteMaterial);

module.exports = router;
