const GroupService = require('../services/group.service');
const { HTTP_STATUS } = require('../config/constants');

class GroupController {
    // Create new group
    static async createGroup(req, res, next) {
        try {
            const { name, description } = req.body;

            if (!name || name.trim() === '') {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: 'Group name is required'
                });
            }

            const group = await GroupService.createGroup({ name, description });

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Group created successfully',
                data: group
            });
        } catch (error) {
            if (error.message === 'Group name already exists') {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: error.message
                });
            }
            next(error);
        }
    }

    // Get all groups
    static async getAllGroups(req, res, next) {
        try {
            const groups = await GroupService.getAllGroups();

            res.status(HTTP_STATUS.OK).json({
                success: true,
                count: groups.length,
                data: groups
            });
        } catch (error) {
            next(error);
        }
    }

    // Get group materials
    static async getGroupMaterials(req, res, next) {
        try {
            const materials = await GroupService.getGroupMaterials(req.params.id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                count: materials.length,
                data: materials
            });
        } catch (error) {
            next(error);
        }
    }

    // Join group
    static async joinGroup(req, res, next) {
        try {
            const { memberName } = req.body;
            const groupId = req.params.id;

            if (!memberName || memberName.trim() === '') {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: 'Member name is required'
                });
            }

            const result = await GroupService.addMember(groupId, memberName);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Successfully joined group',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    // Get group members
    static async getGroupMembers(req, res, next) {
        try {
            const members = await GroupService.getGroupMembers(req.params.id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                count: members.length,
                data: members
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = GroupController;

