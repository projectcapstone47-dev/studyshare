const AuthService = require('../services/auth.service');
const { HTTP_STATUS } = require('../config/constants');

class AuthController {
    // Register new user
    static async register(req, res, next) {
        try {
            const { name, email, password, role, department, semester, phone } = req.body;

            // Validate required fields
            if (!name || !email || !password) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: 'Name, email, and password are required'
                });
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: 'Invalid email format'
                });
            }

            const result = await AuthService.register({
                name,
                email,
                password,
                role,
                department,
                semester,
                phone
            });

            // Set token in cookie
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Registration successful',
                data: {
                    user: result.user,
                    token: result.token
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Login user
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: 'Email and password are required'
                });
            }

            const result = await AuthService.login(email, password);

            // Set token in cookie
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: result.user,
                    token: result.token
                }
            });
        } catch (error) {
            if (error.message.includes('Invalid email') || error.message.includes('deactivated')) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    error: error.message
                });
            }
            next(error);
        }
    }

    // Logout user
    static async logout(req, res) {
        try {
            // Clear cookie
            res.clearCookie('token');

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Logout successful'
            });
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Logout failed'
            });
        }
    }

    // Get current user
    static async getCurrentUser(req, res, next) {
        try {
            if (!req.user) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    error: 'Not authenticated'
                });
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: req.user
            });
        } catch (error) {
            next(error);
        }
    }

    // Change password
    static async changePassword(req, res, next) {
        try {
            const { oldPassword, newPassword, confirmPassword } = req.body;

            // Validate input
            if (!oldPassword || !newPassword || !confirmPassword) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: 'All password fields are required'
                });
            }

            if (newPassword !== confirmPassword) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: 'New passwords do not match'
                });
            }

            const result = await AuthService.changePassword(
                req.user.id,
                oldPassword,
                newPassword
            );

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            if (error.message.includes('incorrect') || error.message.includes('Password must')) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: error.message
                });
            }
            next(error);
        }
    }

    // Verify token (check if logged in)
    static async verifyToken(req, res) {
        try {
            if (req.user) {
                return res.status(HTTP_STATUS.OK).json({
                    success: true,
                    authenticated: true,
                    user: req.user
                });
            }

            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                authenticated: false
            });
        } catch (error) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                authenticated: false
            });
        }
    }
}

module.exports = AuthController;
