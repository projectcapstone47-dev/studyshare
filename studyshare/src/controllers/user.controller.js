const UserService = require('../services/user.service');
const { HTTP_STATUS } = require('../config/constants');

class UserController {
    // Get current user profile
    static async getProfile(req, res, next) {
        try {
            const user = await UserService.getProfile(req.user.id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    // Update current user profile
    static async updateProfile(req, res, next) {
        try {
            const { name, department, semester, phone } = req.body;

            const updatedUser = await UserService.updateProfile(req.user.id, {
                name,
                department,
                semester,
                phone
            });

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedUser
            });
        } catch (error) {
            next(error);
        }
    }

    // Get all users (admin only)
    static async getAllUsers(req, res, next) {
        try {
            const { role, department, semester, is_active, limit } = req.query;

            const users = await UserService.getAllUsers({
                role,
                department,
                semester,
                is_active: is_active !== undefined ? parseInt(is_active) : undefined,
                limit: limit ? parseInt(limit) : undefined
            });

            res.status(HTTP_STATUS.OK).json({
                success: true,
                count: users.length,
                data: users
            });
        } catch (error) {
            next(error);
        }
    }

    // Get user by ID
    static async getUserById(req, res, next) {
        try {
            const userId = parseInt(req.params.id);

            const user = await UserService.getUserById(
                userId,
                req.user.id,
                req.user.role
            );

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: user
            });
        } catch (error) {
            if (error.message === 'Unauthorized access') {
                return res.status(HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    error: error.message
                });
            }
            next(error);
        }
    }

    // Deactivate user (admin only)
    static async deactivateUser(req, res, next) {
        try {
            const userId = parseInt(req.params.id);

            const result = await UserService.deactivateUser(userId);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    // Activate user (admin only)
    static async activateUser(req, res, next) {
        try {
            const userId = parseInt(req.params.id);

            const result = await UserService.activateUser(userId);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete user (admin only)
    static async deleteUser(req, res, next) {
        try {
            const userId = parseInt(req.params.id);

            // Prevent admin from deleting themselves
            if (userId === req.user.id) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: 'You cannot delete your own account'
                });
            }

            const result = await UserService.deleteUser(userId);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    // Get user statistics (admin only)
    static async getStatistics(req, res, next) {
        try {
            const stats = await UserService.getStatistics();

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }

    // Search users
    static async searchUsers(req, res, next) {
        try {
            const { q } = req.query;

            if (!q) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: 'Search query is required'
                });
            }

            const users = await UserService.searchUsers(q);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                count: users.length,
                data: users
            });
        } catch (error) {
            next(error);
        }
    }

    // Get users by role
    static async getUsersByRole(req, res, next) {
        try {
            const { role } = req.params;

            const users = await UserService.getUsersByRole(role);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                count: users.length,
                data: users
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;
