const express = require('express')
const router = express.Router();
const { login, createUserPrincipal, createUserTeacher, deleteUserPrincipal, deleteUserTeacher } = require('../controller/auth')
const { verifyRole, verifyJWT } = require('../middleware/auth')

router.route('/login').post(login)

router.route('/principal/user')
    .post(verifyJWT, verifyRole(["Principal"]), createUserPrincipal)
    .delete(verifyJWT, verifyRole(["Principal"]), deleteUserPrincipal)

router.route('/teacher/user')
    .post(verifyJWT, verifyRole(["Principal", "Teacher"]), createUserTeacher)
    .delete(verifyJWT, verifyRole(["Principal", "Teacher"]), deleteUserTeacher)

module.exports = router