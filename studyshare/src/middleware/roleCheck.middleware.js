const { ROLES, hasPermission } = require('../config/roles');
const { HTTP_STATUS } = require('../config/constants');

// Check if user has required role(s)
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                error: `Access denied. Required role: ${allowedRoles.join(' or ')}`
            });
        }

        next();
    };
};

// Check if user has required permission
const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const userRole = req.user.role;

        if (!hasPermission(userRole, permission)) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                error: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};

// Check if user is admin
const requireAdmin = requireRole(ROLES.ADMIN);

// Check if user is teacher or admin
const requireTeacher = requireRole(ROLES.TEACHER, ROLES.ADMIN);

// Check if user is student (any authenticated user)
const requireStudent = requireRole(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN);

// Check if user owns the resource or is admin
const requireOwnerOrAdmin = (resourceIdParam = 'id', userIdField = 'user_id') => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: 'Authentication required'
            });
        }

        // Admin can access any resource
        if (req.user.role === ROLES.ADMIN) {
            return next();
        }

        // Check if user owns the resource
        const resourceId = req.params[resourceIdParam];
        const userId = req.user.id;

        // This should be customized based on your needs
        // For now, we'll assume the resource check is done in the controller
        req.checkOwnership = { resourceId, userId, userIdField };
        next();
    };
};

module.exports = {
    requireRole,
    requirePermission,
    requireAdmin,
    requireTeacher,
    requireStudent,
    requireOwnerOrAdmin
};
