const express = require('express')
const router = express.Router();
const { login,
    createUserPrincipal,
    createUserTeacher,
    deleteUserPrincipal,
    deleteUserTeacher,
    updateUserPrincipal,
    updateUserTeacher,
    logout,
    getStudentList,
    getTeacherList } = require('../controller/auth')
const { verifyRole, verifyJWT } = require('../middleware/auth')

router.route('/login').post(login)

router.route('/logout').post(logout)

router.route('/principal/user')
    .post(verifyJWT, verifyRole(["Principal"]), createUserPrincipal)
    .put(verifyJWT, verifyRole(["Principal"]), updateUserPrincipal)
    
router.route('/principal/user/:id')
    .delete(verifyJWT, verifyRole(["Principal"]), deleteUserPrincipal)

router.route('/principal/students').get(verifyJWT, verifyRole(["Principal"]), getStudentList)
router.route('/principal/teachers').get(verifyJWT, verifyRole(["Principal"]), getTeacherList)

router.route('/teacher/user')
    .post(verifyJWT, verifyRole(["Principal", "Teacher"]), createUserTeacher)
    .put(verifyJWT, verifyRole(["Principal", "Teacher"]), updateUserTeacher)

router.route('/teacher/user/:id')
    .delete(verifyJWT, verifyRole(["Principal", "Teacher"]), deleteUserTeacher)

module.exports = router