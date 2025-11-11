require('dotenv').config();

module.exports = {
    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
        expiresIn: '24h',
        refreshExpiresIn: '7d'
    },

    // Session Configuration
    session: {
        secret: process.env.SESSION_SECRET || 'your-session-secret-key-change-in-production',
        name: 'studyshare.sid',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    },

    // Password Configuration
    password: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
        saltRounds: 10
    },

    // Token Types
    tokenTypes: {
        ACCESS: 'access',
        REFRESH: 'refresh',
        RESET_PASSWORD: 'resetPassword',
        VERIFY_EMAIL: 'verifyEmail'
    }
};
