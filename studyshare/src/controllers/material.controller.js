const MaterialService = require('../services/material.service');
const { HTTP_STATUS } = require('../config/constants');
const { ROLES } = require('../config/roles');

class MaterialController {
    // Upload new material
    static async uploadMaterial(req, res, next) {
        try {
            const materialData = {
                title: req.body.title,
                subject: req.body.subject,
                semester: req.body.semester,
                uploadedBy: req.user.name, // From authenticated user
                visibility: req.body.visibility || 'public',
                groupId: req.body.groupId || null,
                filePath: req.file.filename,
                fileName: req.file.originalname,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                userId: req.user.id, // NEW: User reference
                isVerified: req.body.is_verified || 0, // NEW: Set by middleware
                uploaderRole: req.body.uploader_role || req.user.role // NEW: User role
            };

            const material = await MaterialService.createMaterial(materialData);

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Material uploaded successfully',
                data: material
            });
        } catch (error) {
            next(error);
        }
    }

    // Get all materials with filters
    static async getAllMaterials(req, res, next) {
        try {
            const filters = {
                subject: req.query.subject,
                semester: req.query.semester,
                search: req.query.search,
                limit: req.query.limit,
                uploaderRole: req.query.uploaderRole, // NEW: Filter by role
                isVerified: req.query.isVerified // NEW: Filter by verified
            };

            const materials = await MaterialService.getAllMaterials(filters);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                count: materials.length,
                data: materials
            });
        } catch (error) {
            next(error);
        }
    }

    // Get material by ID
    static async getMaterialById(req, res, next) {
        try {
            const material = await MaterialService.getMaterialById(req.params.id);

            if (!material) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: 'Material not found'
                });
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: material
            });
        } catch (error) {
            next(error);
        }
    }

    // Download material
    static async downloadMaterial(req, res, next) {
        try {
            const result = await MaterialService.downloadMaterial(req.params.id);

            if (!result) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: 'File not found'
                });
            }

            res.download(result.filePath, result.fileName, (err) => {
                if (err) {
                    next(err);
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete material (NEW)
    static async deleteMaterial(req, res, next) {
        try {
            const materialId = req.params.id;
            const userId = req.user.id;
            const userRole = req.user.role;

            // Get material
            const material = await MaterialService.getMaterialById(materialId);

            if (!material) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: 'Material not found'
                });
            }

            // Check ownership (unless admin)
            if (userRole !== ROLES.ADMIN && material.user_id !== userId) {
                return res.status(HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    error: 'You can only delete your own materials'
                });
            }

            await MaterialService.deleteMaterial(materialId);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Material deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    // Get statistics
    static async getStatistics(req, res, next) {
        try {
            const stats = await MaterialService.getStatistics();

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = MaterialController;
