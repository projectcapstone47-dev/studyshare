const fs = require('fs');
const path = require('path');

class Logger {
    static logDir = path.join(__dirname, '../../logs');

    // Ensure log directory exists
    static ensureLogDir() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    // Format log message
    static formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] ${message}\n`;
    }

    // Write to log file
    static writeLog(filename, message) {
        this.ensureLogDir();
        const filepath = path.join(this.logDir, filename);
        fs.appendFileSync(filepath, message);
    }

    // Info log
    static info(message) {
        const formatted = this.formatMessage('INFO', message);
        console.log(formatted);
        this.writeLog('combined.log', formatted);
    }

    // Error log
    static error(message, error = null) {
        const errorMsg = error ? `${message} - ${error.stack}` : message;
        const formatted = this.formatMessage('ERROR', errorMsg);
        console.error(formatted);
        this.writeLog('error.log', formatted);
        this.writeLog('combined.log', formatted);
    }

    // Warning log
    static warn(message) {
        const formatted = this.formatMessage('WARN', message);
        console.warn(formatted);
        this.writeLog('combined.log', formatted);
    }

    // Debug log
    static debug(message) {
        if (process.env.NODE_ENV === 'development') {
            const formatted = this.formatMessage('DEBUG', message);
            console.log(formatted);
        }
    }
}

module.exports = Logger;
