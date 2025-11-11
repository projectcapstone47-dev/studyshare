const { ROLES, PERMISSIONS, hasPermission } = require('../config/roles');
const { HTTP_STATUS } = require('../config/constants');

// Check if user can upload materials
const canUpload = (req, res, next) => {
    if (!req.user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            error: 'Please login to upload materials'
        });
    }

    const userRole = req.user.role;

    if (!hasPermission(userRole, PERMISSIONS.UPLOAD_MATERIAL)) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            success: false,
            error: 'You do not have permission to upload materials'
        });
    }

    next();
};

// Check if user can delete material
const canDelete = async (req, res, next) => {
    if (!req.user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            error: 'Authentication required'
        });
    }

    const userRole = req.user.role;
    const userId = req.user.id;

    // Admin can delete anything
    if (hasPermission(userRole, PERMISSIONS.DELETE_ANY_MATERIAL)) {
        return next();
    }

    // Users can delete their own materials
    if (hasPermission(userRole, PERMISSIONS.DELETE_OWN_MATERIAL)) {
        // The controller will verify ownership
        req.checkOwnership = true;
        return next();
    }

    return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: 'You do not have permission to delete materials'
    });
};

// Check if user can verify materials (teachers and admin)
const canVerify = (req, res, next) => {
    if (!req.user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            error: 'Authentication required'
        });
    }

    const userRole = req.user.role;

    if (!hasPermission(userRole, PERMISSIONS.VERIFY_MATERIAL)) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            success: false,
            error: 'Only teachers and admins can verify materials'
        });
    }

    next();
};

// Mark material as verified or student content based on uploader role
const markMaterialType = (req, res, next) => {
    if (!req.user) {
        return next();
    }

    const userRole = req.user.role;

    // Set material properties based on uploader role
    if (userRole === ROLES.TEACHER || userRole === ROLES.ADMIN) {
        req.body.is_verified = 1;
        req.body.uploader_role = ROLES.TEACHER;
    } else {
        req.body.is_verified = 0;
        req.body.uploader_role = ROLES.STUDENT;
    }

    // Add user_id to request body
    req.body.user_id = req.user.id;

    next();
};

module.exports = {
    canUpload,
    canDelete,
    canVerify,
    markMaterialType
};
