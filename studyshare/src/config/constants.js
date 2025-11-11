module.exports = {
    // File upload constants
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png'],
    
    // Visibility options
    VISIBILITY: {
        PUBLIC: 'public',
        GROUP: 'group'
    },

    // Semester options
    SEMESTERS: ['1', '2', '3', '4', '5', '6', '7', '8'],

    // Department options
    DEPARTMENTS: [
        'Computer Science',
        'Electronics',
        'Mechanical',
        'Civil',
        'Electrical',
        'Information Technology'
    ],

    // Common subjects (can be expanded)
    SUBJECTS: [
        'Data Structures',
        'Computer Networks',
        'Database Management Systems',
        'Operating Systems',
        'Software Engineering',
        'Web Development',
        'Machine Learning',
        'Digital Electronics',
        'Microprocessors',
        'Engineering Mathematics'
    ],

    // Rate limiting
    RATE_LIMITS: {
        UPLOAD: {
            WINDOW_MS: 15 * 60 * 1000, // 15 minutes
            MAX_REQUESTS: 5
        },
        API: {
            WINDOW_MS: 15 * 60 * 1000,
            MAX_REQUESTS: 100
        }
    },

    // HTTP Status codes
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500
    }
};
