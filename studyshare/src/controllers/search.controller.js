const MaterialModel = require('../models/material.model');
const { HTTP_STATUS } = require('../config/constants');

class SearchController {
    // Search materials
    static async searchMaterials(req, res, next) {
        try {
            const { q, subject, semester } = req.query;

            if (!q || q.trim() === '') {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: 'Search query is required'
                });
            }

            const filters = {
                search: q,
                subject: subject,
                semester: semester
            };

            const materials = await MaterialModel.getAll(filters);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                query: q,
                count: materials.length,
                data: materials
            });
        } catch (error) {
            next(error);
        }
    }

    // Get trending materials (most downloaded)
    static async getTrending(req, res, next) {
        try {
            const limit = req.query.limit || 10;
            
            const materials = await new Promise((resolve, reject) => {
                const { db } = require('../config/database');
                const query = `
                    SELECT * FROM materials 
                    WHERE visibility = 'public'
                    ORDER BY downloads_count DESC 
                    LIMIT ?
                `;
                
                db.all(query, [limit], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });

            res.status(HTTP_STATUS.OK).json({
                success: true,
                count: materials.length,
                data: materials
            });
        } catch (error) {
            next(error);
        }
    }

    // Get recent uploads
    static async getRecent(req, res, next) {
        try {
            const limit = req.query.limit || 10;
            
            const materials = await MaterialModel.getAll({ limit });

            res.status(HTTP_STATUS.OK).json({
                success: true,
                count: materials.length,
                data: materials
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = SearchController;
