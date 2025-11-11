const MaterialModel = require('../models/material.model');
const path = require('path');
const fs = require('fs');

class MaterialService {
    // Create material
    static async createMaterial(materialData) {
        return await MaterialModel.create(materialData);
    }

    // Get all materials with filters
    static async getAllMaterials(filters) {
        return await MaterialModel.getAll(filters);
    }

    // Get material by ID
    static async getMaterialById(id) {
        return await MaterialModel.getById(id);
    }

    // Download material and increment counter
    static async downloadMaterial(id) {
        const material = await MaterialModel.getById(id);
        
        if (!material) {
            return null;
        }

        const filePath = path.join(
            __dirname, 
            '../../', 
            process.env.UPLOAD_PATH || 'uploads/materials', 
            material.file_path
        );

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return null;
        }

        // Increment download count
        await MaterialModel.incrementDownloads(id);

        return {
            filePath: filePath,
            fileName: material.file_name
        };
    }

    // Get statistics
    static async getStatistics() {
        return await MaterialModel.getStats();
    }

    // Delete material
    static async deleteMaterial(id) {
        const material = await MaterialModel.getById(id);
        
        if (!material) {
            throw new Error('Material not found');
        }

        // Delete file from filesystem
        const filePath = path.join(
            __dirname, 
            '../../', 
            process.env.UPLOAD_PATH || 'uploads/materials', 
            material.file_path
        );

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete from database
        return await MaterialModel.delete(id);
    }
}

module.exports = MaterialService;
