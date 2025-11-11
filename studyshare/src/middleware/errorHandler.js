const { HTTP_STATUS } = require('../config/constants');

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.stack);

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'File size too large. Maximum size is 10MB'
        });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'Unexpected field in file upload'
        });
    }

    // Custom errors
    if (err.message.includes('Only PDF, DOC')) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: err.message
        });
    }

    // Database errors
    if (err.message.includes('SQLITE_')) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: 'Database error occurred'
        });
    }

    // Default error
    res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err.message || 'Internal server error'
    });
};

// 404 handler
const notFoundHandler = (req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: 'Route not found'
    });
};

module.exports = { errorHandler, notFoundHandler };
