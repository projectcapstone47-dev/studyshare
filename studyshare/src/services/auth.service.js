const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.model');
const { generateToken } = require('../middleware/auth.middleware');
const { password: passwordConfig } = require('../config/auth');
const { ROLES } = require('../config/roles');

class AuthService {
    // Register new user
    static async register(userData) {
        // Validate email
        const existingUser = await UserModel.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Validate password strength
        this.validatePassword(userData.password);

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, passwordConfig.saltRounds);

        // Set default role if not provided
        if (!userData.role) {
            userData.role = ROLES.STUDENT;
        }

        // Validate role
        if (!Object.values(ROLES).includes(userData.role)) {
            throw new Error('Invalid role');
        }

        // Create user
        const user = await UserModel.create({
            ...userData,
            password: hashedPassword
        });

        // Remove password from response
        delete user.password;

        // Generate token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        });

        return { user, token };
    }

    // Login user
    static async login(email, password) {
        // Find user
        const user = await UserModel.findByEmail(email);
        
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Check if user is active
        if (!user.is_active) {
            throw new Error('Account is deactivated. Please contact admin.');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        // Update last login
        await UserModel.updateLastLogin(user.id);

        // Remove password from response
        delete user.password;

        // Generate token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        });

        return { user, token };
    }

    // Change password
    static async changePassword(userId, oldPassword, newPassword) {
        // Get user
        const user = await UserModel.findById(userId);
        
        if (!user) {
            throw new Error('User not found');
        }

        // Verify old password
        const isValidPassword = await bcrypt.compare(oldPassword, user.password);
        
        if (!isValidPassword) {
            throw new Error('Current password is incorrect');
        }

        // Validate new password
        this.validatePassword(newPassword);

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, passwordConfig.saltRounds);

        // Update password
        await UserModel.updatePassword(userId, hashedPassword);

        return { message: 'Password changed successfully' };
    }

    // Reset password (admin or self)
    static async resetPassword(userId, newPassword) {
        // Validate new password
        this.validatePassword(newPassword);

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, passwordConfig.saltRounds);

        // Update password
        await UserModel.updatePassword(userId, hashedPassword);

        return { message: 'Password reset successfully' };
    }

    // Validate password strength
    static validatePassword(password) {
        if (password.length < passwordConfig.minLength) {
            throw new Error(`Password must be at least ${passwordConfig.minLength} characters long`);
        }

        if (passwordConfig.requireUppercase && !/[A-Z]/.test(password)) {
            throw new Error('Password must contain at least one uppercase letter');
        }

        if (passwordConfig.requireLowercase && !/[a-z]/.test(password)) {
            throw new Error('Password must contain at least one lowercase letter');
        }

        if (passwordConfig.requireNumbers && !/\d/.test(password)) {
            throw new Error('Password must contain at least one number');
        }

        if (passwordConfig.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            throw new Error('Password must contain at least one special character');
        }

        return true;
    }

    // Verify token and get user
    static async verifyTokenAndGetUser(token) {
        try {
            const decoded = verifyToken(token);
            if (!decoded) {
                throw new Error('Invalid token');
            }

            const user = await UserModel.findById(decoded.id);
            if (!user) {
                throw new Error('User not found');
            }

            if (!user.is_active) {
                throw new Error('Account is deactivated');
            }

            delete user.password;
            return user;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
}

module.exports = AuthService;
