const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/auth');
const { HTTP_STATUS } = require('../config/constants');

// Verify JWT token and attach user to request
const authenticateToken = (req, res, next) => {
    try {
        // Get token from header, cookie, or query
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1] || req.cookies?.token || req.query.token;

        if (!token) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: 'Authentication required. Please login.'
            });
        }

        // Verify token
        jwt.verify(token, jwtConfig.secret, (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        error: 'Token expired. Please login again.'
                    });
                }
                
                return res.status(HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    error: 'Invalid token. Please login again.'
                });
            }

            // Attach user to request
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: 'Authentication error'
        });
    }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1] || req.cookies?.token;

        if (!token) {
            req.user = null;
            return next();
        }

        jwt.verify(token, jwtConfig.secret, (err, user) => {
            if (err) {
                req.user = null;
            } else {
                req.user = user;
            }
            next();
        });
    } catch (error) {
        req.user = null;
        next();
    }
};

// Generate JWT token
const generateToken = (payload, expiresIn = jwtConfig.expiresIn) => {
    return jwt.sign(payload, jwtConfig.secret, { expiresIn });
};

// Verify token without middleware
const verifyToken = (token) => {
    try {
        return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
        return null;
    }
};

module.exports = {
    authenticateToken,
    optionalAuth,
    generateToken,
    verifyToken
};
