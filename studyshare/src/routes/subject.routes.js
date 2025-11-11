const express = require('express');
const router = express.Router();
const SubjectController = require('../controllers/subject.controller');

// Get all subjects
router.get('/', SubjectController.getAllSubjects);

// Get subjects by semester
router.get('/semester/:semester', SubjectController.getSubjectsBySemester);

// Get subject names (for autocomplete)
router.get('/names', SubjectController.getSubjectNames);

// Create subject
router.post('/', SubjectController.createSubject);

module.exports = router;
