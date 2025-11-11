const express = require('express');
const router = express.Router();
const GroupController = require('../controllers/group.controller');

// Create group
router.post('/', GroupController.createGroup);

// Get all groups
router.get('/', GroupController.getAllGroups);

// Get group materials
router.get('/:id/materials', GroupController.getGroupMaterials);

// Join group
router.post('/:id/join', GroupController.joinGroup);

// Get group members
router.get('/:id/members', GroupController.getGroupMembers);

module.exports = router;
