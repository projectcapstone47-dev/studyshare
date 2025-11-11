const GroupModel = require('../models/group.model');
const MaterialModel = require('../models/material.model');

class GroupService {
    // Create group
    static async createGroup(groupData) {
        return await GroupModel.create(groupData);
    }

    // Get all groups
    static async getAllGroups() {
        return await GroupModel.getAll();
    }

    // Get group by ID
    static async getGroupById(id) {
        return await GroupModel.getById(id);
    }

    // Get group materials
    static async getGroupMaterials(groupId) {
        return await MaterialModel.getByGroup(groupId);
    }

    // Add member to group
    static async addMember(groupId, memberName) {
        // Check if group exists
        const group = await GroupModel.getById(groupId);
        
        if (!group) {
            throw new Error('Group not found');
        }

        return await GroupModel.addMember(groupId, memberName);
    }

    // Get group members
    static async getGroupMembers(groupId) {
        return await GroupModel.getMembers(groupId);
    }
}

module.exports = GroupService;
