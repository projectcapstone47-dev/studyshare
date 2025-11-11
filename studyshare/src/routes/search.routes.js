const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/search.controller');

// Search materials
router.get('/', SearchController.searchMaterials);

// Get trending materials
router.get('/trending', SearchController.getTrending);

// Get recent uploads
router.get('/recent', SearchController.getRecent);

module.exports = router;
