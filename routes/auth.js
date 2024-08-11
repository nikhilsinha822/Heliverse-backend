const express = require('express')
const router = express.Router();
const { login, createUserPrincipal, createUserTeacher } = require('../controller/auth')
const { verifyRole, verifyJWT } = require('../middleware/auth')

router.route('/login').post(login)

router.route('/principal/user', verifyJWT, verifyRole("Principal"))
    .post(createUserPrincipal);

router.route('/teacher/user', verifyJWT, verifyRole("Teacher"))
    .post(createUserTeacher);

module.exports = router