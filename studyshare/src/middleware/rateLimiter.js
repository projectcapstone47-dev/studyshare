const rateLimit = require('express-rate-limit');
const { RATE_LIMITS } = require('../config/constants');

// Rate limiter for file uploads
const uploadLimiter = rateLimit({
    windowMs: RATE_LIMITS.UPLOAD.WINDOW_MS,
    max: RATE_LIMITS.UPLOAD.MAX_REQUESTS,
    message: {
        error: 'Too many uploads from this IP. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: RATE_LIMITS.API.WINDOW_MS,
    max: RATE_LIMITS.API.MAX_REQUESTS,
    message: {
        error: 'Too many requests from this IP. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { uploadLimiter, apiLimiter };
