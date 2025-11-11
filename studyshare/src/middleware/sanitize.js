// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
    // Sanitize body parameters
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                // Remove potentially dangerous characters
                req.body[key] = req.body[key]
                    .trim()
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/<[^>]+>/g, ''); // Remove HTML tags
            }
        }
    }

    // Sanitize query parameters
    if (req.query) {
        for (let key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = req.query[key]
                    .trim()
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/<[^>]+>/g, '');
            }
        }
    }

    next();
};

module.exports = { sanitizeInput };
