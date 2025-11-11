const path = require('path');
const fs = require('fs');

class FileHelpers {
    // Get file extension
    static getFileExtension(filename) {
        return path.extname(filename).toLowerCase().substring(1);
    }

    // Get file icon based on type
    static getFileIcon(mimetype) {
        if (mimetype.includes('pdf')) return '📄';
        if (mimetype.includes('word') || mimetype.includes('document')) return '📝';
        if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return '📊';
        if (mimetype.includes('image')) return '🖼️';
        return '📁';
    }

    // Format file size
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    // Sanitize filename
    static sanitizeFilename(filename) {
        return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    }

    // Check if file exists
    static fileExists(filepath) {
        return fs.existsSync(filepath);
    }

    // Delete file
    static deleteFile(filepath) {
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            return true;
        }
        return false;
    }

    // Get file MIME type from extension
    static getMimeType(extension) {
        const mimeTypes = {
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'ppt': 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png'
        };
        
        return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
    }
}

module.exports = FileHelpers;
