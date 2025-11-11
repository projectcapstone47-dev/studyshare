class Validators {
    // Validate email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate string length
    static isValidLength(str, min, max) {
        const length = str.trim().length;
        return length >= min && length <= max;
    }

    // Validate semester
    static isValidSemester(semester) {
        const validSemesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
        return validSemesters.includes(semester.toString());
    }

    // Validate file size
    static isValidFileSize(size, maxSize) {
        return size <= maxSize;
    }

    // Validate alphanumeric with spaces
    static isAlphanumericWithSpaces(str) {
        const regex = /^[a-zA-Z0-9\s]+$/;
        return regex.test(str);
    }

    // Sanitize HTML
    static sanitizeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    // Validate required fields
    static validateRequiredFields(obj, requiredFields) {
        const missing = [];
        
        for (const field of requiredFields) {
            if (!obj[field] || obj[field].toString().trim() === '') {
                missing.push(field);
            }
        }
        
        return {
            isValid: missing.length === 0,
            missingFields: missing
        };
    }
}

module.exports = Validators;
