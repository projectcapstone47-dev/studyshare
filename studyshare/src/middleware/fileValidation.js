const path = require('path');
const { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = require('../config/constants');

const validateFileUpload = (req, res, next) => {
    // Check if file exists
    if (!req.file) {
        return res.status(400).json({
            success: false,
            error: 'No file uploaded'
        });
    }

    // Validate file size
    if (req.file.size > MAX_FILE_SIZE) {
        return res.status(400).json({
            success: false,
            error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
        });
    }

    // Validate file extension
    const fileExt = path.extname(req.file.originalname).toLowerCase().substring(1);
    if (!ALLOWED_FILE_TYPES.includes(fileExt)) {
        return res.status(400).json({
            success: false,
            error: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
        });
    }

    next();
};

const validateMaterialData = (req, res, next) => {
    const { title, subject, semester, uploadedBy } = req.body;

    // Validate required fields
    if (!title || title.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Title is required'
        });
    }

    if (!subject || subject.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Subject is required'
        });
    }

    if (!semester || semester.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Semester is required'
        });
    }

    if (!uploadedBy || uploadedBy.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Uploader name is required'
        });
    }

    next();
};

module.exports = { validateFileUpload, validateMaterialData };
