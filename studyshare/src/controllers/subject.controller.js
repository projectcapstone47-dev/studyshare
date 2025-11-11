const SubjectModel = require('../models/subject.model');
const { HTTP_STATUS } = require('../config/constants');

class SubjectController {
    // Get all subjects
    static async getAllSubjects(req, res, next) {
        try {
            const subjects = await SubjectModel.getAll();

            res.status(HTTP_STATUS.OK).json({
                success: true,
                count: subjects.length,
                data: subjects
            });
        } catch (error) {
            next(error);
        }
    }

    // Get subjects by semester
    static async getSubjectsBySemester(req, res, next) {
        try {
            const subjects = await SubjectModel.getBySemester(req.params.semester);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                count: subjects.length,
                data: subjects
            });
        } catch (error) {
            next(error);
        }
    }

    // Get unique subject names
    static async getSubjectNames(req, res, next) {
        try {
            const names = await SubjectModel.getUniqueNames();

            res.status(HTTP_STATUS.OK).json({
                success: true,
                count: names.length,
                data: names
            });
        } catch (error) {
            next(error);
        }
    }

    // Create new subject
    static async createSubject(req, res, next) {
        try {
            const { name, department, semester } = req.body;

            if (!name || name.trim() === '') {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: 'Subject name is required'
                });
            }

            const subject = await SubjectModel.create({ name, department, semester });

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Subject created successfully',
                data: subject
            });
        } catch (error) {
            if (error.message === 'Subject already exists') {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: error.message
                });
            }
            next(error);
        }
    }
}

module.exports = SubjectController;
