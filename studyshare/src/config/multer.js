const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const UPLOAD_PATH = process.env.UPLOAD_PATH || './uploads/materials';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 10485760; // 10MB

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_PATH)) {
    fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_PATH);
    },
    filename: function (req, file, cb) {
        // Generate unique filename: randomHash_timestamp_originalname
        const uniquePrefix = crypto.randomBytes(8).toString('hex');
        const timestamp = Date.now();
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        const filename = `${uniquePrefix}_${timestamp}_${sanitizedName}`;
        cb(null, filename);
    }
});

// File filter for allowed types
const fileFilter = (req, file, cb) => {
    const allowedExtensions = /pdf|doc|docx|ppt|pptx|jpg|jpeg|png/;
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/jpg',
        'image/png'
    ];

    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.includes(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, DOC, DOCX, PPT, PPTX, JPG, and PNG files are allowed'), false);
    }
};

// Initialize multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter: fileFilter
});

module.exports = upload;
