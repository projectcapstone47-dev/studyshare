const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const { sanitizeInput } = require('./middleware/sanitize');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { session: sessionConfig } = require('./config/auth');
const routes = require('./routes');

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false // Allow inline scripts for simplicity
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Session middleware
app.use(session({
    store: new SQLiteStore({
        db: 'sessions.db',
        dir: './database'
    }),
    secret: sessionConfig.secret,
    name: sessionConfig.name,
    resave: sessionConfig.resave,
    saveUninitialized: sessionConfig.saveUninitialized,
    cookie: sessionConfig.cookie
}));

// Sanitize input
app.use(sanitizeInput);

// Rate limiting for API
app.use('/api', apiLimiter);

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api', routes);

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/login.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/register.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/dashboard.html'));
});

app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/profile.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/admin.html'));
});

app.get('/upload.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/upload.html'));
});

app.get('/browse.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/browse.html'));
});

app.get('/groups.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/groups.html'));
});

app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/about.html'));
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;
