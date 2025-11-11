const UserModel = require('../models/user.model');
const { ROLES } = require('../config/roles');

class UserService {
    // Get user profile
    static async getProfile(userId) {
        const user = await UserModel.findById(userId);
        
        if (!user) {
            throw new Error('User not found');
        }

        // Remove sensitive data
        delete user.password;

        return user;
    }

    // Update user profile
    static async updateProfile(userId, updateData) {
        // Don't allow updating role, password, or is_active through this method
        delete updateData.role;
        delete updateData.password;
        delete updateData.is_active;

        const result = await UserModel.update(userId, updateData);
        
        if (result.changes === 0) {
            throw new Error('User not found or no changes made');
        }

        return await this.getProfile(userId);
    }

    // Get all users (admin only)
    static async getAllUsers(filters = {}) {
        return await UserModel.getAll(filters);
    }

    // Get user by ID (admin or self)
    static async getUserById(userId, requesterId, requesterRole) {
        // Check if requester can access this user's data
        if (requesterRole !== ROLES.ADMIN && userId !== requesterId) {
            throw new Error('Unauthorized access');
        }

        const user = await UserModel.findById(userId);
        
        if (!user) {
            throw new Error('User not found');
        }

        delete user.password;
        return user;
    }

    // Deactivate user (admin only)
    static async deactivateUser(userId) {
        const result = await UserModel.deactivate(userId);
        
        if (result.changes === 0) {
            throw new Error('User not found');
        }

        return { message: 'User deactivated successfully' };
    }

    // Activate user (admin only)
    static async activateUser(userId) {
        const result = await UserModel.activate(userId);
        
        if (result.changes === 0) {
            throw new Error('User not found');
        }

        return { message: 'User activated successfully' };
    }

    // Delete user (admin only)
    static async deleteUser(userId) {
        const result = await UserModel.delete(userId);
        
        if (result.changes === 0) {
            throw new Error('User not found');
        }

        return { message: 'User deleted successfully' };
    }

    // Get user statistics
    static async getStatistics() {
        return await UserModel.getStats();
    }

    // Search users
    static async searchUsers(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            throw new Error('Search term is required');
        }

        return await UserModel.search(searchTerm);
    }

    // Get users by role
    static async getUsersByRole(role) {
        if (!Object.values(ROLES).includes(role)) {
            throw new Error('Invalid role');
        }

        return await UserModel.getAll({ role });
    }

    // Get users by department
    static async getUsersByDepartment(department) {
        return await UserModel.getAll({ department });
    }
}

module.exports = UserService;
