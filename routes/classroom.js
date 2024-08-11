const express = require('express');
const { verifyRole, verifyJWT } = require('../middleware/auth');
const { getClassroom, createClassroom, assignTeacher, assignStudents, getStudentList } = require('../controller/classroom');
const router = express.Router();

router.route('/')
    .get(verifyJWT, verifyRole(["Principal"]), getClassroom)

router.route('/create')
    .post(verifyJWT, verifyRole(['Principal']), createClassroom)

router.route('/participants/:classroomId')
    .get(verifyJWT, getStudentList)

router.route('/addTeacher/:classroomId')
    .put(verifyJWT, verifyRole(['Principal']), assignTeacher)

router.route('/addStudents/:classroomId')
    .put(verifyJWT, verifyRole(['Principal', 'Teacher']), assignStudents)

module.exports = router